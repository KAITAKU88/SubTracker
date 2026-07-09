import { BillingCycle } from './subscription';
export type { Currency, CoreCurrency } from './currency';
export { CURRENCY_PRIORITY, currencySymbols, getCurrencyLabel, getCurrencySymbol } from './currency';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  cycle: BillingCycle;
  purchaseDate: string;
  lastPaidDate?: string;
  color: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  paidAt: string;
}

export type BillingCycle = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export const cycleLabels: Record<BillingCycle, string> = {
  weekly: 'hàng tuần',
  monthly: 'hàng tháng',
  quarterly: 'hàng quý',
  yearly: 'hàng năm',
};
