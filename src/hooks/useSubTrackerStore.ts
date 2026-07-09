import { useCallback, useEffect, useRef, useState } from 'react';
import { Subscription } from '../types/subscription';
import { loadAppData, saveAppData } from '../storage/database';
import { registerActiveUserIfNew } from '../services/analytics';

export function useSubTrackerStore() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isHydrated = useRef(false);

  useEffect(() => {
    loadAppData().then((data) => {
      setSubscriptions(data.subscriptions);
      setIsLoading(false);
      isHydrated.current = true;
    });
  }, []);

  useEffect(() => {
    if (!isHydrated.current) return;
    saveAppData({ subscriptions, payments: [] });
  }, [subscriptions]);

  const addSubscription = useCallback((data: Omit<Subscription, 'id' | 'createdAt'>) => {
    const newSub: Subscription = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setSubscriptions((prev) => [...prev, newSub]);
    void registerActiveUserIfNew();
  }, []);

  const updateSubscription = useCallback((sub: Subscription) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === sub.id ? sub : s)));
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return {
    subscriptions,
    isLoading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  };
}
