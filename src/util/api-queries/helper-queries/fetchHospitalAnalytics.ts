  import { posthogSafeClient } from "../posthog";
import { InsightQuery } from "../posthog/schema";
import { splitInsightByEventName, filterInsightByEventName } from "../../posthog-analytics-helper";
import { forkJoin, from, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
const PROJECT_TZ = process.env.POSTHOG_TZ || 'Asia/Manila';

export const fetchHospitalAnalytics = (
  projectId: string,
  apiKey: string,
  dateRange: { date_from: string; date_to: string },
) => {
  // Helper: create ad-hoc insight then fetch its result (Observable)
  const executeInsightQuery$ = (queryPayload: InsightQuery) =>
    from(
      posthogSafeClient.getInsights(queryPayload, {
        params: { project_id: projectId },
        headers: { Authorization: `Bearer ${apiKey}` },
      }),
    ).pipe(
      switchMap((createResponse) => {
        if (createResponse.error || !createResponse.data?.id) {
          console.error("Failed to create insight:", createResponse.error && "response" in createResponse.error ? createResponse.error.response?.data : createResponse.error);
          return of({ data: null, error: createResponse.error });
        }
        return from(
          posthogSafeClient.getInsightResult({
            params: { project_id: projectId, id: createResponse.data.id },
            queries: { refresh: "blocking" },
            headers: { Authorization: `Bearer ${apiKey}` },
          }),
        );
      }),
    );

  // ---------- Batched queries ----------
  // A) KPI totals (5 series)
  const kpiTotalsRes$ = executeInsightQuery$({
    query: {
      kind: "TrendsQuery",
      dateRange,
      series: [
        { kind: "EventsNode", event: "doctor-directory-view-profile" },
        { kind: "EventsNode", event: "doctor-directory-search" },
        { kind: "EventsNode", event: "doctor-directory-filters-applied" },
        { kind: "EventsNode", event: "doctor-directory-booking-link" },
        { kind: "EventsNode", event: "doctor-page-booking" },
      ],
      trendsFilter: { display: "ActionsTable" },
      filterTestAccounts: process.env.ENVIRONMENT !== "development",
    },
  });

  // B) Per-doctor tables in 1 query (3 series + one breakdown)
  const byDoctorRes$ = executeInsightQuery$({
    query: {
      kind: "TrendsQuery",
      dateRange,
      series: [
        { kind: "EventsNode", event: "doctor-directory-view-profile" },
        { kind: "EventsNode", event: "doctor-directory-booking-link" },
        { kind: "EventsNode", event: "doctor-page-booking" },
      ],
      trendsFilter: { display: "ActionsTable" },
      breakdownFilter: { breakdown: "doctorName", breakdown_type: "event", breakdown_limit: 1000 },
      filterTestAccounts: process.env.ENVIRONMENT !== "development",
    },
  });

  // Heatmap A: total pageviews by (day,hour)
  const pageViewsByDayAndHourRes$ = executeInsightQuery$({
    query: {
      kind: "TrendsQuery",
      dateRange,
      series: [{ kind: "EventsNode", event: "$pageview", math: "total" }],
      trendsFilter: { display: "ActionsTable" },
      breakdownFilter: {
        breakdown: `tuple(modulo(toDayOfWeek(toTimeZone(timestamp, '${PROJECT_TZ}')), 7), toHour(toTimeZone(timestamp, '${PROJECT_TZ}')))`,
        breakdown_type: "hogql",
        breakdown_limit: 1000,
      },
      filterTestAccounts: process.env.ENVIRONMENT !== "development",
    },
  });

  // Heatmap B: unique users (DAU) by (day,hour)
  const uniqueUsersByDayAndHourRes$ = executeInsightQuery$({
    query: {
      kind: "TrendsQuery",
      dateRange,
      series: [{ kind: "EventsNode", event: "$pageview", math: "dau" }],
      trendsFilter: { display: "ActionsTable" },
      breakdownFilter: {
        breakdown: `tuple(modulo(toDayOfWeek(toTimeZone(timestamp, '${PROJECT_TZ}')), 7), toHour(toTimeZone(timestamp, '${PROJECT_TZ}')))`,
        breakdown_type: "hogql",
        breakdown_limit: 1000,
      },
      filterTestAccounts: process.env.ENVIRONMENT !== "development",
    },
  });

  // Daily Active Users (DAU) by device type
  const dauRes$ = executeInsightQuery$({
    query: {
      kind: "TrendsQuery",
      dateRange,
      series: [{ kind: "EventsNode", event: "$pageview", math: "dau" }],
      interval: "day",
      breakdownFilter: { breakdown: "$device_type", breakdown_type: "event" },
      filterTestAccounts: process.env.ENVIRONMENT !== "development",
    },
  });

  // Referrers (use Table to get totals-only)
  const referrersRes$ = executeInsightQuery$({
    query: {
      kind: "TrendsQuery",
      dateRange,
      series: [{ kind: "EventsNode", event: "$pageview" }],
      breakdownFilter: { breakdown: "$referring_domain", breakdown_type: "event" },
      trendsFilter: { display: "ActionsTable" },
      filterTestAccounts: process.env.ENVIRONMENT !== "development",
    },
  });

  const topSearchesRes$ = executeInsightQuery$({
    query: {
      kind: "TrendsQuery",
      dateRange,
      series: [{ kind: "EventsNode", event: "doctor-directory-search" }],
      breakdownFilter: { breakdown: "query", breakdown_type: "event" },
      trendsFilter: { display: "ActionsTable" },
      filterTestAccounts: process.env.ENVIRONMENT !== "development",
    },
  });

  const topFiltersRes$ = executeInsightQuery$({
    query: {
      kind: "TrendsQuery",
      dateRange,
      series: [{ kind: "EventsNode", event: "doctor-directory-filters-applied" }],
      breakdownFilter: { breakdown: "specializations", breakdown_type: "event" },
      trendsFilter: { display: "ActionsTable" },
      filterTestAccounts: process.env.ENVIRONMENT !== "development",
    },
  });

  const pageViewsByPathRes$ = executeInsightQuery$({
    query: {
      kind: "TrendsQuery",
      dateRange,
      series: [{ kind: "EventsNode", event: "$pageview" }],
      breakdownFilter: { breakdown: "$pathname", breakdown_type: "event" },
      trendsFilter: { display: "ActionsTable" },
      filterTestAccounts: process.env.ENVIRONMENT !== "development",
    },
  });

  // Execute all in parallel
  return forkJoin([
    kpiTotalsRes$,
    byDoctorRes$,
    dauRes$,
    referrersRes$,
    topSearchesRes$,
    topFiltersRes$,
    pageViewsByPathRes$,
    pageViewsByDayAndHourRes$,
    uniqueUsersByDayAndHourRes$,
  ]).pipe(
    map(([
      kpiTotalsResRaw,
      byDoctorResRaw,
      dauRes,
      referrersRes,
      topSearchesRes,
      topFiltersRes,
      pageViewsByPathRes,
      pageViewsByDayAndHourResRaw,
      uniqueUsersByDayAndHourResRaw,
    ]) => {
      const kpiTotalsRes = kpiTotalsResRaw.data;
      const byDoctorRes = byDoctorResRaw.data;

      // ---------- Split batched results back into your expected single-series shapes ----------
      // KPI totals -> 5 virtual single-series responses
      const doctorViewsRes = {
        data: splitInsightByEventName(kpiTotalsRes, "doctor-directory-view-profile"),
        error: null,
      };
      const searchesRes = {
        data: splitInsightByEventName(kpiTotalsRes, "doctor-directory-search"),
        error: null,
      };
      const filtersAppliedRes = {
        data: splitInsightByEventName(kpiTotalsRes, "doctor-directory-filters-applied"),
        error: null,
      };
      const dirBookingLinkRes = {
        data: splitInsightByEventName(kpiTotalsRes, "doctor-directory-booking-link"),
        error: null,
      };
      const pageBookingRes = {
        data: splitInsightByEventName(kpiTotalsRes, "doctor-page-booking"),
        error: null,
      };

      // Per-doctor tables -> 3 virtual single-series responses
      // Note: these are still multi-series inside (one per doctorName)
      const doctorProfileViewsByDoctorRes = {
        data: filterInsightByEventName(byDoctorRes, "doctor-directory-view-profile"),
        error: null,
      };
      const dirBookingClicksByDoctorRes = {
        data: filterInsightByEventName(byDoctorRes, "doctor-directory-booking-link"),
        error: null,
      };
      const pageBookingsByDoctorRes = {
        data: filterInsightByEventName(byDoctorRes, "doctor-page-booking"),
        error: null,
      };

      const pageViewsByDayAndHourRes = { data: pageViewsByDayAndHourResRaw.data, error: null };
      const uniqueUsersByDayAndHourRes = { data: uniqueUsersByDayAndHourResRaw.data, error: null };

      return {
        dauRes,
        referrersRes,
        doctorViewsRes,
        searchesRes,
        filtersAppliedRes,
        dirBookingLinkRes,
        pageBookingRes,
        topSearchesRes,
        topFiltersRes,
        doctorProfileViewsByDoctorRes,
        dirBookingClicksByDoctorRes,
        pageBookingsByDoctorRes,
        pageViewsByPathRes,
        pageViewsByDayAndHourRes,
        uniqueUsersByDayAndHourRes,
      };
    }),
  );
};