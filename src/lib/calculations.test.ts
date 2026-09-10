import assert from "node:assert/strict";
import test from "node:test";

import { calculateMonthlyAmount, calculateTotalMonthlyAmount, parseExpensesFromStorage, splitExpensesForStory } from "./calculations.ts";

test("normalizes recurring expenses to a fixed 30-day total", () => {
  assert.equal(calculateMonthlyAmount({ amount: 26000, interval: 3, intervalUnit: "day" }), 260000);
  assert.equal(calculateMonthlyAmount({ amount: 300000, interval: 8, intervalUnit: "day" }), 1125000);
  assert.equal(calculateMonthlyAmount({ amount: 100000, interval: 2, intervalUnit: "week" }), 214286);
  assert.equal(calculateMonthlyAmount({ amount: 600000, interval: 2, intervalUnit: "month" }), 300000);
});

test("returns zero for invalid recurring expense values", () => {
  assert.equal(calculateMonthlyAmount({ amount: 0, interval: 3, intervalUnit: "day" }), 0);
  assert.equal(calculateMonthlyAmount({ amount: 26000, interval: 0, intervalUnit: "day" }), 0);
  assert.equal(calculateMonthlyAmount({ amount: Number.NaN, interval: 3, intervalUnit: "day" }), 0);
});

test("adds normalized recurring expenses into one 30-day prediction", () => {
  assert.equal(calculateTotalMonthlyAmount([
    { amount: 26000, interval: 3, intervalUnit: "day" },
    { amount: 300000, interval: 8, intervalUnit: "day" },
  ]), 1385000);
});

test("safely restores only valid expenses from saved browser data", () => {
  const saved = JSON.stringify([
    { id: "galon", name: "Galon", emoji: "💧", amount: 26000, interval: 3, intervalUnit: "day" },
    { id: "broken", name: "", amount: 200, interval: 2, intervalUnit: "year" },
  ]);

  assert.deepEqual(parseExpensesFromStorage(saved), [
    { id: "galon", name: "Galon", emoji: "💧", amount: 26000, interval: 3, intervalUnit: "day" },
  ]);
  assert.deepEqual(parseExpensesFromStorage("not-json"), []);
});

test("keeps five expenses in a story and summarizes the remaining monthly total", () => {
  const expenses = [
    { id: "a", name: "Galon", amount: 26000, interval: 4, intervalUnit: "day" as const },
    { id: "b", name: "Kuota", amount: 45000, interval: 28, intervalUnit: "day" as const },
    { id: "c", name: "Listrik", amount: 300000, interval: 1, intervalUnit: "month" as const },
    { id: "d", name: "Bensin", amount: 100000, interval: 1, intervalUnit: "week" as const },
    { id: "e", name: "Kopi", amount: 25000, interval: 7, intervalUnit: "day" as const },
    { id: "f", name: "Laundry", amount: 50000, interval: 2, intervalUnit: "week" as const },
  ];

  const story = splitExpensesForStory(expenses);

  assert.deepEqual(story.featured.map((expense) => expense.id), ["a", "b", "c", "d", "e"]);
  assert.equal(story.remainingCount, 1);
  assert.equal(story.remainingTotal, 107143);
});
