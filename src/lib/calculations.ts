export type IntervalUnit = "day" | "week" | "month";

export type RecurringExpenseInput = {
  amount: number;
  interval: number;
  intervalUnit: IntervalUnit;
};

export type Expense = RecurringExpenseInput & {
  id: string;
  name: string;
  emoji?: string;
};

export function calculateMonthlyAmount({
  amount,
  interval,
  intervalUnit,
}: RecurringExpenseInput): number {
  if (!Number.isFinite(amount) || !Number.isFinite(interval) || amount <= 0 || interval <= 0) {
    return 0;
  }

  const denominator = intervalUnit === "day" ? interval : intervalUnit === "week" ? interval * 7 : interval;
  const monthlyAmount = intervalUnit === "month" ? amount / denominator : (amount / denominator) * 30;

  return Math.round(monthlyAmount);
}

export function calculateTotalMonthlyAmount(expenses: RecurringExpenseInput[]) {
  return expenses.reduce((total, expense) => total + calculateMonthlyAmount(expense), 0);
}

export function splitExpensesForStory(expenses: Expense[], featuredLimit = 4) {
  const featured = expenses.slice(0, featuredLimit);
  const remaining = expenses.slice(featuredLimit);

  return {
    featured,
    remainingCount: remaining.length,
    remainingTotal: calculateTotalMonthlyAmount(remaining),
  };
}

export function parseExpensesFromStorage(value: string | null): Expense[] {
  if (!value) return [];

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is Expense => {
      if (!item || typeof item !== "object") return false;
      const expense = item as Record<string, unknown>;
      return (
        typeof expense.id === "string" &&
        typeof expense.name === "string" &&
        expense.name.trim().length > 0 &&
        typeof expense.amount === "number" &&
        Number.isFinite(expense.amount) &&
        expense.amount > 0 &&
        typeof expense.interval === "number" &&
        Number.isFinite(expense.interval) &&
        expense.interval > 0 &&
        (expense.intervalUnit === "day" || expense.intervalUnit === "week" || expense.intervalUnit === "month") &&
        (expense.emoji === undefined || typeof expense.emoji === "string")
      );
    });
  } catch {
    return [];
  }
}
