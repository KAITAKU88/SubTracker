import { getStoredItem, setStoredItem } from '../storage/adapter';
import { CURRENCY_PRIORITY } from '../types/currency';

const CACHE_KEY = '@subtracker/exchange-rates/v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const API_URL = 'https://open.er-api.com/v6/latest/USD';

/** Số VND cho 1 đơn vị tiền tệ */
export type VndRates = Record<string, number>;

export interface ExchangeRateCache {
  vndRates: VndRates;
  fetchedAt: number;
  source: 'network' | 'cache' | 'fallback';
}

const FALLBACK_VND_RATES: VndRates = {
  VND: 1,
  USD: 26_000,
  JPY: 170,
  CNY: 3_600,
  EUR: 28_000,
};

function buildVndRatesFromUsdBase(usdRates: Record<string, number>): VndRates {
  const vndPerUsd = usdRates.VND;
  if (!vndPerUsd) throw new Error('API thiếu tỉ giá VND');

  const result: VndRates = { VND: 1, USD: vndPerUsd };

  for (const [code, perUsd] of Object.entries(usdRates)) {
    if (code === 'VND' || perUsd <= 0) continue;
    result[code] = vndPerUsd / perUsd;
  }

  return result;
}

async function fetchRatesFromNetwork(): Promise<VndRates> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(API_URL, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (data.result !== 'success' || !data.rates) {
      throw new Error('Dữ liệu tỉ giá không hợp lệ');
    }

    return buildVndRatesFromUsdBase(data.rates);
  } finally {
    clearTimeout(timeout);
  }
}

export async function loadCachedRates(): Promise<ExchangeRateCache | null> {
  try {
    const raw = await getStoredItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ExchangeRateCache;
  } catch {
    return null;
  }
}

export async function saveCachedRates(cache: ExchangeRateCache): Promise<void> {
  await setStoredItem(CACHE_KEY, JSON.stringify(cache));
}

function isCacheFresh(fetchedAt: number): boolean {
  return Date.now() - fetchedAt < CACHE_TTL_MS;
}

export function getFallbackRates(): ExchangeRateCache {
  return {
    vndRates: { ...FALLBACK_VND_RATES },
    fetchedAt: 0,
    source: 'fallback',
  };
}

export async function resolveExchangeRates(): Promise<ExchangeRateCache> {
  const cached = await loadCachedRates();

  if (cached && isCacheFresh(cached.fetchedAt)) {
    return { ...cached, source: 'cache' };
  }

  try {
    const vndRates = await fetchRatesFromNetwork();
    const fresh: ExchangeRateCache = {
      vndRates,
      fetchedAt: Date.now(),
      source: 'network',
    };
    await saveCachedRates(fresh);
    return fresh;
  } catch {
    if (cached) {
      return { ...cached, source: 'cache' };
    }
    return getFallbackRates();
  }
}

export async function refreshExchangeRates(): Promise<ExchangeRateCache> {
  try {
    const vndRates = await fetchRatesFromNetwork();
    const fresh: ExchangeRateCache = {
      vndRates,
      fetchedAt: Date.now(),
      source: 'network',
    };
    await saveCachedRates(fresh);
    return fresh;
  } catch {
    const cached = await loadCachedRates();
    if (cached) return { ...cached, source: 'cache' };
    return getFallbackRates();
  }
}

export function getRateFor(vndRates: VndRates, currency: string): number {
  return vndRates[currency] ?? FALLBACK_VND_RATES[currency] ?? vndRates.USD ?? FALLBACK_VND_RATES.USD;
}

export function getAvailableCurrencies(vndRates: VndRates): string[] {
  const codes = Object.keys(vndRates);
  const ordered = [...CURRENCY_PRIORITY.filter((c) => codes.includes(c))];
  const rest = codes
    .filter((c) => !CURRENCY_PRIORITY.includes(c as (typeof CURRENCY_PRIORITY)[number]))
    .sort();
  return [...ordered, ...rest];
}
