export type AnalyticsCallback = (
  event: string,
  details: Record<string, string>,
) => void;
