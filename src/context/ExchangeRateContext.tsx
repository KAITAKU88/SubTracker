import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ExchangeRateCache,
  getAvailableCurrencies,
  getFallbackRates,
  refreshExchangeRates,
  resolveExchangeRates,
  VndRates,
} from '../services/exchangeRates';

interface ExchangeRateContextValue {
  vndRates: VndRates;
  availableCurrencies: string[];
  isLoading: boolean;
  lastUpdated: number | null;
  source: ExchangeRateCache['source'];
  refresh: () => Promise<void>;
}

const ExchangeRateContext = createContext<ExchangeRateContextValue | null>(null);

export function ExchangeRateProvider({ children }: { children: React.ReactNode }) {
  const [cache, setCache] = useState<ExchangeRateCache>(getFallbackRates());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    resolveExchangeRates().then((data) => {
      setCache(data);
      setIsLoading(false);
    });
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const data = await refreshExchangeRates();
    setCache(data);
    setIsLoading(false);
  }, []);

  const value = useMemo<ExchangeRateContextValue>(
    () => ({
      vndRates: cache.vndRates,
      availableCurrencies: getAvailableCurrencies(cache.vndRates),
      isLoading,
      lastUpdated: cache.fetchedAt || null,
      source: cache.source,
      refresh,
    }),
    [cache, isLoading, refresh]
  );

  return (
    <ExchangeRateContext.Provider value={value}>
      {children}
    </ExchangeRateContext.Provider>
  );
}

export function useExchangeRates(): ExchangeRateContextValue {
  const ctx = useContext(ExchangeRateContext);
  if (!ctx) {
    throw new Error('useExchangeRates must be used within ExchangeRateProvider');
  }
  return ctx;
}
