export type AnalyticsEvent =
  | "start_calculate"
  | "add_expense_item"
  | "calculation_completed"
  | "export_image";

type AnalyticsEventParameters = {
  start_calculate: undefined;
  add_expense_item: { interval_unit: "day" | "week" | "month"; item_count: number };
  calculation_completed: { item_count: number };
  export_image: { item_count: number };
};

type Gtag = (command: "event", eventName: string, parameters?: Record<string, unknown>) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

function isAnalyticsEnabled() {
  return process.env.NODE_ENV === "production" && Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
}

export function trackEvent<EventName extends AnalyticsEvent>(
  eventName: EventName,
  ...[parameters]: AnalyticsEventParameters[EventName] extends undefined
    ? []
    : [AnalyticsEventParameters[EventName]]
) {
  if (!isAnalyticsEnabled() || typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", eventName, parameters);
}

export function trackPageView(path: string) {
  if (!isAnalyticsEnabled() || typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "page_view", { page_path: path });
}
