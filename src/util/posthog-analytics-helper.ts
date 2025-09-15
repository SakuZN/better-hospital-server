import { InsightResponse } from "./api-queries/posthog/schema";
import { GenericChartData, RetentionTableData } from "@/interface/analytics-types";

/**
 * Transforms trends data (like daily active users) into a format for Recharts.
 * @param response The raw trends response from the PostHog API.
 * @param seriesName The name to give the data series (e.g., "Active Users").
 * @returns An array of objects suitable for line or bar charts.
 */
export function transformTrendsDataForChart(
  response: InsightResponse | null,
  seriesName: string,
): GenericChartData {
  if (!response?.result?.[0]) {
    return [];
  }

  const series = response.result[0];
  if (!series.data || !series.labels) {
    return [];
  }

  return series.labels.map((label: string, index: number) => ({
    date: new Date(label).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    [seriesName]: series.data[index] ?? 0,
  }));
}

/**
 * Helper function to process breakdown values that may be JSON stringified arrays
 * @param breakdownValue The raw breakdown value from PostHog
 * @returns Processed value as string or the original value
 */
function processBreakdownValue(breakdownValue: any): string | any {
  if (typeof breakdownValue === 'string') {
    // Try to parse as JSON array if it looks like one
    if (breakdownValue.startsWith('[') && breakdownValue.endsWith(']')) {
      try {
        const parsedArray = JSON.parse(breakdownValue);
        if (Array.isArray(parsedArray)) {
          // Filter out empty strings and join non-empty values
          const filteredValues = parsedArray.filter((val: any) =>
            val !== null && val !== undefined && val !== ""
          );

          // Return joined string if array has values, otherwise return null to filter out
          return filteredValues.length > 0 ? filteredValues.join(', ') : null;
        }
      } catch (e) {
        // If JSON parsing fails, return the original string
        return breakdownValue;
      }
    }
    // Handle other special cases
    if (breakdownValue === "$$_posthog_breakdown_other_$$") {
      return "Others";
    }
    if (breakdownValue === "" || breakdownValue === "$$_posthog_breakdown_null_$$") {
      return "(none)";
    }
    return breakdownValue;
  }

  // Handle actual arrays (non-stringified)
  if (Array.isArray(breakdownValue)) {
    const filteredValues = breakdownValue.filter((val: any) =>
      val !== null && val !== undefined && val !== "" && val !== "(none)"
    );
    return filteredValues.length > 0 ? filteredValues.join(', ') : null;
  }

  return breakdownValue;
}

/**
 * Transforms breakdown data (like page views by URL) for pie or bar charts.
 * @param response The raw trends response with breakdown data.
 * @param nameKey The key for the item's name (e.g., "Page").
 * @param valueKey The key for the item's value (e.g., "Views").
 * @returns An array of objects suitable for pie or bar charts.
 */
export function transformBreakdownDataForChart(
  response: InsightResponse | null,
  nameKey: string,
  valueKey: string,
): GenericChartData {
  if (!response?.result) {
    return [];
  }

  return response.result
    .map((item: any) => ({
      [nameKey]: processBreakdownValue(item.breakdown_value),
      [valueKey]: item?.count && item.count > 0 ? item.count : item?.aggregated_value || 0,
    }))
    .filter((item: any) => {
      const validCount = typeof item[valueKey] === "number" && item[valueKey] > 0;
      const validName = item[nameKey] !== null && item[nameKey] !== undefined && item[nameKey] !== "Others";
      return validCount && validName;
    })
    .sort((a: any, b: any) => (b[valueKey] as number) - (a[valueKey] as number));
}

/**
 * Transforms retention data into a format for a table/heatmap.
 * @param response The raw retention response from the PostHog API.
 * @returns An array of objects representing rows in a retention table.
 */
export function transformRetentionDataForTable(
  response: InsightResponse | null,
): RetentionTableData {
  if (!response?.result) {
    return [];
  }

  return response.result.map((cohort: any) => {
    const total = cohort.values[0]?.count ?? 0;
    return {
      date: new Date(cohort.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      total,
      // Calculate percentage for each subsequent period
      periods: cohort.values.map((period: any) =>
        total > 0 ? Math.round((period.count / total) * 100) : 0,
      ),
    };
  });
}

/**
 * Extracts a single total count from a trends response, typically from a "BoldNumber" display.
 * @param response The raw trends response from the PostHog API.
 * @returns The total count, or 0 if not found.
 */
export function getTotalCountFromTrends(response: InsightResponse | null): number {
  const result = response?.result?.[0];
  if (typeof result?.aggregated_value === 'number') {
    return result.aggregated_value;
  }
  return 0;
}

/**
 * Transforms trends data with a breakdown into a format for multi-series charts (e.g., stacked bar chart).
 * @param response The raw trends response with breakdown data.
 * @returns An array where each object represents a date, with keys for each breakdown value.
 * e.g., [{ date: 'Jul 29', Desktop: 10, Mobile: 15 }, ...]
 */
export function transformBreakdownTrendsForChart(
  response: InsightResponse | null,
): GenericChartData {
  if (!response?.result || response.result.length === 0) {
    return [];
  }

  // All series share the same labels/days, so we can grab them from the first series.
  const labels = response.result[0].labels;
  if (!labels) {
    return [];
  }

  // Create a map of breakdown value -> data array for quick lookups
  const seriesMap = new Map<string, number[]>();
  response.result.forEach((series: any) => {
    if (series.breakdown_value && series.data) {
      const breakdownValue = series.breakdown_value === "$$_posthog_breakdown_other_$$"
        ? "Others"
        : series.breakdown_value;
      seriesMap.set(breakdownValue, series.data);
    }
  });

  // Pivot the data: turn rows into columns
  return labels.map((label: string, index: number) => {
    const dataPoint: { [key: string]: string | number } = {
      date: new Date(label).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };

    seriesMap.forEach((data, breakdownValue) => {
      dataPoint[breakdownValue] = data[index] ?? 0;
    });

    return dataPoint;
  });
}

/**
 * Transforms a PostHog trends query with a multi-breakdown (day, hour)
 * into a 7x24 matrix suitable for a heatmap chart.
 * @param response The raw trends response from the PostHog API.
 * @returns A number[][] array where rows are days (0-6, Sun-Sat) and columns are hours (0-23).
 */
export function transformActivityDataForHeatmap(
  response: InsightResponse | null,
): number[][] {
  const heatmap: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
  if (!response?.result) return heatmap;

  for (const item of response.result as any[]) {
    let day: number | undefined;
    let hour: number | undefined;
    const bv = item.breakdown_value;

    if (Array.isArray(bv) && bv.length === 2) {
      day = Number(bv[0]);
      hour = Number(bv[1]);
    } else if (typeof bv === "string") {
      // Accept "(1, 10)", "1,10", "[1,10]"
      const m = bv.match(/-?\d+/g);
      if (m && m?.length >= 2) {
        day = Number(m[0]);
        hour = Number(m[1]);
      }
    }

    if (day === 7) day = 0; // normalize Sun to 0
    if (day! >= 0 && day! < 7 && hour! >= 0 && hour! < 24) {
      const val = typeof item.aggregated_value === "number"
        ? item.aggregated_value
        : (typeof item.count === "number" ? item.count : 0);
      heatmap[day!][hour!] += val;
    }
  }
  return heatmap;
}

/**
 * Returns a virtual single-series InsightResponse by picking 1 result item
 * that matches the predicate.
 */
export function splitInsightByPredicate(
  res: InsightResponse | null,
  predicate: (r: any) => boolean,
): InsightResponse | null {
  if (!res?.result) return null
  const match = (res.result as any[]).find(predicate)
  if (!match) return null
  return {
    ...res,
    result: [match], // single-series virtual response
  }
}

/** Selects a series by its event/action name (falls back to label if needed). */
export function splitInsightByEventName(
  res: InsightResponse | null,
  eventName: string,
): InsightResponse | null {
  return splitInsightByPredicate(
    res,
    (r) => (r?.action?.name ?? r?.label) === eventName,
  )
}

export function filterInsightByEventName(
  res: InsightResponse | null,
  eventName: string,
): InsightResponse | null {
  if (!res?.result) return null
  const rows = (res.result as any[]).filter(
    (r) => (r?.action?.name ?? "") === eventName
  )
  if (rows.length === 0) return null
  return { ...res, result: rows }
}

/** Selects a series by its math, e.g. "total" or "unique". */
export function splitInsightByMath(
  res: InsightResponse | null,
  math: string,
): InsightResponse | null {
  const wanted = math.toLowerCase()
  return splitInsightByPredicate(
    res,
    (r) => String(r?.action?.math ?? "").toLowerCase() === wanted,
  )
}