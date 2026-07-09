import { BillingCycle } from '../types/subscription';
import { getCurrencySymbol } from '../types/currency';
import { getRateFor, VndRates } from '../services/exchangeRates';

const MONTHLY_CYCLE_FACTOR: Record<BillingCycle, number> = {
  weekly: 52 / 12,
  monthly: 1,
  quarterly: 1 / 3,
  yearly: 1 / 12,
};

export function toMonthlyVnd(
  amount: number,
  currency: string,
  cycle: BillingCycle,
  vndRates: VndRates
): number {
  const rate = getRateFor(vndRates, currency);
  const inVnd = amount * rate;
  return Math.round(inVnd * MONTHLY_CYCLE_FACTOR[cycle]);
}

export function formatVnd(amount: number): string {
  return `${amount.toLocaleString('vi-VN')} đ`;
}

export function advanceDueDate(dateStr: string, cycle: BillingCycle): string {
  const d = new Date(dateStr + 'T00:00:00');
  switch (cycle) {
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
    case 'quarterly':
      d.setMonth(d.getMonth() + 3);
      break;
    case 'yearly':
      d.setFullYear(d.getFullYear() + 1);
      break;
  }
  return d.toISOString().split('T')[0];
}

export function formatAmount(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);

  if (currency === 'VND' || currency === 'JPY' || currency === 'KRW') {
    return `${Math.round(amount).toLocaleString('vi-VN')} ${symbol}`;
  }

  return `${symbol}${amount.toFixed(2)}`;
}

export function formatRateUpdated(fetchedAt: number | null, source: string): string {
  if (!fetchedAt) return 'Tỉ giá mặc định (offline)';

  const date = new Date(fetchedAt).toLocaleDateString('vi-VN');
  if (source === 'network') return `Tỉ giá cập nhật ${date}`;
  if (source === 'cache') return `Tỉ giá cache · ${date}`;
  return 'Tỉ giá mặc định (offline)';
}

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + 'T00:00:00');
  const diff = due.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatDateVi(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('vi-VN');
}

export function formatDateLongVi(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const weekday = d.toLocaleDateString('vi-VN', { weekday: 'long' });
  const day = d.getDate();
  const month = d.toLocaleDateString('vi-VN', { month: 'long' });
  const year = d.getFullYear();
  return `${weekday.charAt(0).toUpperCase() + weekday.slice(1)}, ${day} ${month}, ${year}`;
}

export function formatMonthShort(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('vi-VN', { month: 'short' }).toUpperCase();
}

export function getDay(dateStr: string): number {
  return new Date(dateStr + 'T00:00:00').getDate();
}

export function getUpcomingRenewals(
  nextDueDate: string,
  cycle: BillingCycle,
  count = 4
): string[] {
  const dates: string[] = [nextDueDate];
  let current = nextDueDate;

  for (let i = 1; i < count; i++) {
    current = advanceDueDate(current, cycle);
    dates.push(current);
  }

  return dates;
}
