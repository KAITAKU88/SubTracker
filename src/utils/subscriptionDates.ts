import { BillingCycle, Subscription } from '../types/subscription';
import { advanceDueDate } from './format';

export interface DueDateInput {
  purchaseDate: string;
  cycle: BillingCycle;
  lastPaidDate?: string;
}

export function getNextDueDate(sub: DueDateInput): string {
  if (sub.lastPaidDate) {
    return advanceDueDate(sub.lastPaidDate, sub.cycle);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let due = sub.purchaseDate;
  let cursor = new Date(due + 'T00:00:00');

  if (cursor >= today) {
    return due;
  }

  while (cursor < today) {
    due = advanceDueDate(due, sub.cycle);
    cursor = new Date(due + 'T00:00:00');
  }

  return due;
}

export function sortByNextDue(a: Subscription, b: Subscription): number {
  return (
    new Date(getNextDueDate(a)).getTime() - new Date(getNextDueDate(b)).getTime()
  );
}

export function migrateSubscription(raw: Record<string, unknown>): Subscription {
  const legacy = raw as Subscription & { nextDueDate?: string };
  return {
    id: String(legacy.id),
    name: String(legacy.name),
    amount: Number(legacy.amount),
    currency: String(legacy.currency),
    cycle: legacy.cycle,
    purchaseDate: legacy.purchaseDate ?? legacy.nextDueDate ?? new Date().toISOString().split('T')[0],
    lastPaidDate: legacy.lastPaidDate,
    color: String(legacy.color),
    createdAt: String(legacy.createdAt),
  };
}
