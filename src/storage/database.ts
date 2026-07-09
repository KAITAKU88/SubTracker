import { AppData, EMPTY_APP_DATA } from './types';
import { migrateSubscription } from '../utils/subscriptionDates';
import { getStoredItem, removeStoredItem, setStoredItem } from './adapter';

const STORAGE_KEY = '@subtracker/data/v1';

export async function loadAppData(): Promise<AppData> {
  try {
    const raw = await getStoredItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_APP_DATA };

    const parsed = JSON.parse(raw) as AppData;
    return {
      subscriptions: Array.isArray(parsed.subscriptions)
        ? parsed.subscriptions.map((s) => migrateSubscription(s as unknown as Record<string, unknown>))
        : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : [],
    };
  } catch {
    return { ...EMPTY_APP_DATA };
  }
}

export async function saveAppData(data: AppData): Promise<void> {
  await setStoredItem(STORAGE_KEY, JSON.stringify(data));
}

export async function clearAppData(): Promise<void> {
  await removeStoredItem(STORAGE_KEY);
}
