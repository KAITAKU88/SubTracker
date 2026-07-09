import { Subscription, PaymentRecord } from '../types/subscription';

export interface AppData {
  subscriptions: Subscription[];
  payments: PaymentRecord[];
}

export const EMPTY_APP_DATA: AppData = {
  subscriptions: [],
  payments: [],
};
