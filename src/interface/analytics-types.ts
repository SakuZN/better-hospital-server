export type KpiCardData = {
  totalSearches: number;
  profileViews: number;
  bookingIntent: number;
  conversionRate: string;
};

export type BookingFunnelData = {
  searches: number;
  profileViews: number;
  bookingClicks: number;
};

export type DailyActiveUserChartData = Array<{
  date: string;
  "Active Users": number;
}>;

export type ReferringDomainChartData = Array<{
  Domain: string;
  Visitors: number;
}>;

export type TopSearchChartData = Array<{
  Query: string;
  Searches: number;
}>;

export type DailyActiveUsersByDeviceChartData = Array<{
  date: string;
  [deviceType: string]: string | number;
}>;

export type TopFilterChartData = Array<{
  Specialization: string;
  Count: number;
}>;

export type SearchInsightsData = {
  topSearches: TopSearchChartData;
  topFilters: TopFilterChartData;
};

export type RetentionTableData = Array<{
  date: string;
  total: number;
  periods: number[];
}>;

export type DoctorEngagementData = Array<{
  doctorName: string;
  views: number;
  totalBookings: number;
}>;

export type TopPagesData = Array<{
  path: string;
  views: number;
}>;

// A generic type for the reusable AnalyticsCard component
export type GenericChartData = Array<Record<string, string | number>>;