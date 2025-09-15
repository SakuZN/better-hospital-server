import { fetchHospitalAnalytics } from "@/util/api-queries/helper-queries/fetchHospitalAnalytics";
import supabase from "@/util/supabase/client";
import { from, Observable, of } from "rxjs";
import { mergeMap, toArray, tap, map, catchError, switchMap } from "rxjs/operators";
import { sendEmbedNotification } from "@/util/api-queries/helper-queries/sendEmbedNotification";
import { getAnalyticsDateRange } from "@/util/date-utils";
import { Json } from "@/util/supabase/types";

type AnalyticsResult = {
  status: "success" | "failed";
  hospitalId: string;
  duration: number;
  error?: string;
};

export const runHospitalAnalyticsCron = () => {
  const overallStartTime = Date.now();

  const dateRange = getAnalyticsDateRange(30);

  // Start notification (non-blocking)
  of(null)
    .pipe(
      tap(() => {
        void sendEmbedNotification({
          content: {
            title: "Analytics Cron Job Started",
            description: "Starting to fetch daily hospital analytics data.",
            color: 0x3498db,
          },
          bot_name: "Analytics Cron",
        }).catch(() => console.error("Failed to send start embed"));
      }),
      // Fetch configs
      switchMapToObservable(() =>
        from(
          supabase
            .from("posthog_config")
            .select("id, company_id, project_id, project_key")
            .not("company_id", "is", null),
        ),
      ),
      tap(({ error, data }) => {
        if (error || !data) {
          console.error("Failed to fetch posthog_config", error);
          void sendEmbedNotification({
            content: {
              title: "Analytics Cron Job Failed",
              description: "Failed to fetch PostHog configurations.",
              color: 0xe74c3c,
              fields: [
                {
                  name: "Error",
                  value: error?.message || "No configurations found.",
                },
              ],
            },
            bot_name: "Analytics Cron",
          }).catch(() => console.error("Failed to send failure embed:"));
        }
      }),
      // Branch: handle empty or error
      switchMap(({ data: configs, error }) => {
        if (error || !configs || configs.length === 0) {
          // If empty, send finished notification and complete.
          if (!error && configs && configs.length === 0) {
            void sendEmbedNotification({
              content: {
                title: "Analytics Cron Job Finished",
                description: "No hospital configurations found to process.",
                color: 0xf1c40f,
              },
              bot_name: "Analytics Cron",
            }).catch((e) => console.error("Failed to send empty embed:", e));
          }
          return of([] as AnalyticsResult[]);
        }

        return from(configs).pipe(
          mergeMap((config) => {
            const hospitalStartTime = Date.now();
            const hospitalId = config.company_id!;

            return fetchHospitalAnalytics(
              String(config.project_id),
              config.project_key,
              dateRange,
            ).pipe(
              map((analyticsRes) => {
                const errorLog: string[] = [];
                const safeGet = (key: keyof typeof analyticsRes) => {
                  const res = analyticsRes[key]
                  if (res?.error) {
                    errorLog.push(`${String(key)}: ${res.error?.message || res.error}`);
                  }
                  return res?.data ?? null;
                };

                const analyticsDataForStorage = {
                  dauRes: safeGet("dauRes"),
                  referrersRes: safeGet("referrersRes"),
                  doctorViewsRes: safeGet("doctorViewsRes"),
                  searchesRes: safeGet("searchesRes"),
                  filtersAppliedRes: safeGet("filtersAppliedRes"),
                  dirBookingLinkRes: safeGet("dirBookingLinkRes"),
                  pageBookingRes: safeGet("pageBookingRes"),
                  topSearchesRes: safeGet("topSearchesRes"),
                  topFiltersRes: safeGet("topFiltersRes"),
                  doctorProfileViewsByDoctorRes: safeGet("doctorProfileViewsByDoctorRes"),
                  dirBookingClicksByDoctorRes: safeGet("dirBookingClicksByDoctorRes"),
                  pageBookingsByDoctorRes: safeGet("pageBookingsByDoctorRes"),
                  pageViewsByPathRes: safeGet("pageViewsByPathRes"),
                  pageViewsByDayAndHourRes: safeGet("pageViewsByDayAndHourRes"),
                  uniqueUsersByDayAndHourRes: safeGet("uniqueUsersByDayAndHourRes"),
                } as unknown as Json;

                if (errorLog.length > 0) {
                  console.error(
                    `Analytics errors for hospital ${hospitalId}:\n${errorLog.join("\n")}`,
                  );
                }

                return analyticsDataForStorage;
              }),
              // Insert into Supabase
              mergeMap((analyticsDataForStorage) =>
                from(
                  supabase
                    .from("posthog_analytics")
                    .upsert({
                      hospital_id: hospitalId,
                      analytics: analyticsDataForStorage,
                      params: dateRange as unknown as Json,
                    }, {
                      onConflict: "hospital_id",
                    }),
                ).pipe(
                  map(({ error }) => {
                    if (error) {
                      throw new Error(`Supabase insert failed: ${error.message}`);
                    }
                    return {
                      status: "success" as const,
                      hospitalId,
                      duration: Date.now() - hospitalStartTime,
                    };
                  }),
                  catchError((e) =>
                    of({
                      status: "failed" as const,
                      hospitalId,
                      duration: Date.now() - hospitalStartTime,
                      error: e?.message || String(e),
                    }),
                  ),
                ),
              ),
              catchError((e) =>
                of({
                  status: "failed" as const,
                  hospitalId,
                  duration: Date.now() - hospitalStartTime,
                  error: e?.message || String(e),
                } as AnalyticsResult),
              ),
            );
          }, 2),
          toArray(),
        ) as Observable<AnalyticsResult[]>;
      }),
      tap((finalResults: AnalyticsResult[]) => {
        const overallDuration = Date.now() - overallStartTime;
        const successCount = finalResults.filter((r) => r.status === "success").length;
        const failedCount = finalResults.filter((r) => r.status === "failed").length;

        const summaryFields = [
          { name: "Total Processed", value: String(finalResults.length), inline: true },
          { name: "Succeeded", value: String(successCount), inline: true },
          { name: "Failed", value: String(failedCount), inline: true },
        ];

        const resultFields = finalResults.map((r) => ({
          name: `Hospital: ${r.hospitalId}`,
          value: `Status: ${r.status} | Duration: ${(r.duration / 1000).toFixed(2)}s${
            (r as any).error ? `\nError: \`\`\`${String((r as any).error).substring(0, 100)}\`\`\`` : ""
          }`,
          inline: false,
        }));

        const fields = [...summaryFields, ...resultFields.slice(0, 22)];

        console.log("Final results:", finalResults);

        void sendEmbedNotification({
          content: {
            title: "Analytics Cron Job Finished",
            description: `Job finished in ${(overallDuration / 1000).toFixed(2)}s.`,
            color: failedCount > 0 ? 0xe74c3c : 0x2ecc71,
            fields,
          },
          bot_name: "Analytics Cron",
        }).catch((e) => console.error("Failed to send finish embed:", e));
      }),
      catchError((e) => {
        console.error("Unexpected error in Analytics Cron:", e);
        return of([]);
      }),
    )
    .subscribe();
};

function switchMapToObservable<T, R>(
  project: (value: T) => Observable<R>,
) {
  return (source: Observable<T>) =>
    source.pipe(mergeMap((v) => project(v)));
}
