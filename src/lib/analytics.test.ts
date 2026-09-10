import assert from "node:assert/strict";
import test from "node:test";

import { trackEvent } from "./analytics.ts";

const environment = process.env as Record<string, string | undefined>;
const originalNodeEnv = environment.NODE_ENV;
const originalMeasurementId = environment.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const browser = globalThis as unknown as {
  window?: { gtag?: (...args: unknown[]) => void };
};

function restoreEnvironment() {
  environment.NODE_ENV = originalNodeEnv;
  environment.NEXT_PUBLIC_GA_MEASUREMENT_ID = originalMeasurementId;
  delete browser.window;
}

test("trackEvent sends only the approved event payload when GA is enabled", () => {
  const calls: unknown[][] = [];
  environment.NODE_ENV = "production";
  environment.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST123";
  browser.window = { gtag: (...args) => calls.push(args) };

  trackEvent("add_expense_item", { interval_unit: "week", item_count: 2 });

  assert.deepEqual(calls, [["event", "add_expense_item", { interval_unit: "week", item_count: 2 }]]);
  restoreEnvironment();
});

test("trackEvent is a no-op outside production or without a Measurement ID", () => {
  const calls: unknown[][] = [];
  environment.NODE_ENV = "development";
  environment.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST123";
  browser.window = { gtag: (...args) => calls.push(args) };

  trackEvent("start_calculate");
  environment.NODE_ENV = "production";
  delete environment.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  trackEvent("start_calculate");

  assert.deepEqual(calls, []);
  restoreEnvironment();
});
