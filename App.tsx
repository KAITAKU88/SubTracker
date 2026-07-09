import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Platform, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './src/theme/colors';
import { Subscription } from './src/types/subscription';
import { HomeScreen } from './src/screens/HomeScreen';
import { DetailScreen } from './src/screens/DetailScreen';
import { AddSubscriptionModal } from './src/components/AddSubscriptionModal';
import { ExchangeRateProvider } from './src/context/ExchangeRateContext';
import { useSubTrackerStore } from './src/hooks/useSubTrackerStore';

type Screen = 'home' | 'detail';

export default function App() {
  const {
    subscriptions,
    isLoading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubTrackerStore();

  const [screen, setScreen] = useState<Screen>('home');
  const [selected, setSelected] = useState<Subscription | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Subscription | null>(null);

  const handleSelect = useCallback((sub: Subscription) => {
    setSelected(sub);
    setScreen('detail');
  }, []);

  const handleUpdate = useCallback(
    (sub: Subscription) => {
      updateSubscription(sub);
      setSelected(sub);
    },
    [updateSubscription]
  );

  const handleDelete = useCallback(() => {
    if (!selected) return;
    deleteSubscription(selected.id);
    setSelected(null);
    setScreen('home');
  }, [selected, deleteSubscription]);

  const currentSelected =
    selected ? subscriptions.find((s) => s.id === selected.id) ?? selected : null;

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ExchangeRateProvider>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <View style={styles.root}>
          <View style={styles.phoneFrame}>
            {screen === 'home' ? (
              <HomeScreen
                subscriptions={subscriptions}
                onSelect={handleSelect}
                onAdd={() => {
                  setEditTarget(null);
                  setShowModal(true);
                }}
              />
            ) : currentSelected ? (
              <DetailScreen
                subscription={currentSelected}
                onBack={() => setScreen('home')}
                onEdit={() => {
                  setEditTarget(currentSelected);
                  setShowModal(true);
                }}
                onDelete={handleDelete}
              />
            ) : null}
          </View>
        </View>

        <AddSubscriptionModal
          visible={showModal}
          onClose={() => {
            setShowModal(false);
            setEditTarget(null);
          }}
          onAdd={addSubscription}
          editData={editTarget}
          onUpdate={handleUpdate}
        />
      </ExchangeRateProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  root: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#08080A' : colors.background,
    alignItems: 'center',
  },
  phoneFrame: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    backgroundColor: colors.background,
    ...Platform.select({
      web: {
        marginVertical: 24,
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#2A2A32',
        overflow: 'hidden',
        minHeight: 'calc(100vh - 48px)' as unknown as number,
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      },
    }),
  },
});
