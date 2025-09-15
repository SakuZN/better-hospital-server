import { DateTime, DateTimeUnit } from "luxon";

type NullableISODate = string | null | undefined;

export function dateWithinRange(
  date: NullableISODate,
  range: "7days" | "14days" | "30days" | "90days" | "1year",
) {
  if (!date) return false;
  const parsedDate = DateTime.fromISO(date).setZone("Asia/Manila");
  const now = DateTime.now().setZone("Asia/Manila");
  const diff = now.diff(parsedDate, ["days"]);
  const days = diff.days;
  switch (range) {
    case "7days":
      return days <= 7;
    case "14days":
      return days <= 14;
    case "30days":
      return days <= 30;
    case "90days":
      return days <= 90;
    case "1year":
      return days <= 365;
    default:
      return false;
  }
}

export function validateDate(date: NullableISODate): boolean {
  if (!date) return false;
  const parsedDate = DateTime.fromISO(date).setZone("Asia/Manila");
  return parsedDate.isValid;
}
function fixDate(date: string | Date | number): string {
  if (typeof date === "number") {
    return new Date(date).toISOString();
  }
  if (date instanceof Date) {
    return date.toISOString();
  }
  const dateParts = date.split(" ");
  if (dateParts.length === 2) {
    return `${dateParts[0]}T${dateParts[1]}`;
  }
  return date;
}

export function formatTimeAgo(date: NullableISODate): string {
  if (!date) return "N/A";
  let newDate = date;
  if (!validateDate(date)) {
    newDate = fixDate(date);
  }
  const now = DateTime.now().setZone("Asia/Manila");
  const diff = now.diff(DateTime.fromISO(newDate).setZone("Asia/Manila"), [
    "seconds",
    "minutes",
    "hours",
    "days",
    "months",
    "years",
  ]);

  if (diff.seconds <= 60 && diff.minutes < 1) {
    return "a few seconds ago";
  }

  if (diff.minutes <= 60 && diff.hours < 1) {
    return `${Math.round(diff.minutes)} minute${Math.round(diff.minutes) !== 1 ? "s" : ""} ago`;
  }

  if (diff.hours <= 24 && diff.days < 1) {
    return `${Math.round(diff.hours)} hour${Math.round(diff.hours) !== 1 ? "s" : ""} ago`;
  }

  if (diff.days <= 30 && diff.months < 1) {
    return `${Math.round(diff.days)} day${Math.round(diff.days) !== 1 ? "s" : ""} ago`;
  }

  if (diff.months <= 12 && diff.years < 1) {
    return `${Math.ceil(diff.months)} month${Math.ceil(diff.months) !== 1 ? "s" : ""} ago`;
  }

  return `${Math.ceil(diff.years)} year${Math.ceil(diff.years) !== 1 ? "s" : ""} ago`;
}

export function parseDate(
  date: NullableISODate,
  format?: string,
  zone: "Asia/Manila" | "UTC" = "Asia/Manila",
): string {
  if (!date) return "N/A";
  let newDate = date;
  if (!validateDate(date)) {
    newDate = fixDate(date);
  }

  const parsedDate = DateTime.fromISO(newDate).setZone(zone);
  return parsedDate.toFormat(format || "MMMM dd, yyyy");
}

export function isDateSame(date1: NullableISODate, date2: NullableISODate) {
  if (!date1 || !date2) return false;
  let newDate1 = date1;
  let newDate2 = date2;

  if (!validateDate(date1)) {
    newDate1 = fixDate(date1);
  }
  if (!validateDate(date2)) {
    newDate2 = fixDate(date2);
  }

  const parsedDate1 = DateTime.fromISO(newDate1.toString()).setZone(
    "Asia/Manila",
  );
  const parsedDate2 = DateTime.fromISO(newDate2.toString()).setZone(
    "Asia/Manila",
  );

  return parsedDate1.hasSame(parsedDate2, "day");
}

export const formatTime = (
  isoString: NullableISODate,
  zone: "Asia/Manila" | "UTC" = "Asia/Manila",
): string => {
  if (!isoString) {
    return "N/A";
  }

  // 1. Parse the ISO string. Luxon correctly identifies the 'Z' as UTC.
  const dt = DateTime.fromISO(isoString).setZone(zone);

  return dt.toFormat("h:mm a");
};

export const dateComparison = (
  date1: NullableISODate,
  date2: NullableISODate,
  comparison: "before" | "after" | "same" = "same",
  zone: "Asia/Manila" | "UTC" = "Asia/Manila",
): boolean => {
  if (!date1 || !date2) {
    return false;
  }

  const dt1 = DateTime.fromISO(date1).setZone(zone);
  const dt2 = DateTime.fromISO(date2).setZone(zone);

  switch (comparison) {
    case "before":
      return dt1 < dt2;
    case "after":
      return dt1 > dt2;
    case "same":
      return dt1.hasSame(dt2, "day");
    default:
      return false;
  }
};

export const isWithinDateRange = (
  date1: NullableISODate,
  date2: NullableISODate,
  date3: NullableISODate,
  range: DateTimeUnit = "day",
  zone: "Asia/Manila" | "UTC" = "Asia/Manila",
): boolean => {
  if (!date1 || !date2 || !date3) {
    return false;
  }

  const dt1 = DateTime.fromISO(date1).setZone(zone);
  const dt2 = DateTime.fromISO(date2).setZone(zone);
  const dt3 = DateTime.fromISO(date3).setZone(zone);

  // check if date3 is within the range of date1 and date2
  return dt3 >= dt1 && dt3 <= dt2 && dt1.hasSame(dt2, range);
};

export const getAnalyticsDateRange = (
  daysAgo: number,
  zone: "Asia/Manila" | "UTC" = "Asia/Manila",
) => {
  const today = DateTime.now().setZone(zone);
  // PostHog insights are based on events from the previous day.
  // "date_to" should be yesterday to get the most recent full day of data.
  const dateTo = today.minus({ days: 1 });
  const dateFrom = dateTo.minus({ days: daysAgo - 1 });

  return {
    date_from: parseDate(dateFrom.toISO(), "yyyy-MM-dd", zone),
    date_to: parseDate(dateTo.toISO(), "yyyy-MM-dd", zone),
  };
};