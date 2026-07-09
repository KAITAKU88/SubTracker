import React, { useCallback } from 'react';
import { fonts } from '../theme/fonts';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Share,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { fabElevation, fabElevationPressed } from '../theme/elevation';
import { Subscription } from '../types/subscription';
import { useExchangeRates } from '../context/ExchangeRateContext';
import { getNextDueDate, sortByNextDue } from '../utils/subscriptionDates';
import { toMonthlyVnd, formatRateUpdated } from '../utils/format';
import { MonthlySummaryCard } from '../components/MonthlySummaryCard';
import { UpcomingReminder } from '../components/UpcomingReminder';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { DonateFooter } from '../components/DonateFooter';
import { LANDING_PAGE_URL, SHARE_MESSAGE, SHARE_TITLE } from '../config/app';

interface HomeScreenProps {
  subscriptions: Subscription[];
  onSelect: (sub: Subscription) => void;
  onAdd: () => void;
}

export function HomeScreen({ subscriptions, onSelect, onAdd }: HomeScreenProps) {
  const { vndRates, lastUpdated, source } = useExchangeRates();
  const insets = useSafeAreaInsets();

  const sorted = [...subscriptions].sort(sortByNextDue);

  const totalMonthlyVnd = subscriptions.reduce(
    (sum, s) => sum + toMonthlyVnd(s.amount, s.currency, s.cycle, vndRates),
    0
  );

  const nearest = sorted[0];

  const handleShare = useCallback(async () => {
    const message = `${SHARE_MESSAGE}\n${LANDING_PAGE_URL}`;
    try {
      await Share.share(
        Platform.OS === 'ios'
          ? { message, url: LANDING_PAGE_URL, title: SHARE_TITLE }
          : { message, title: SHARE_TITLE }
      );
    } catch {
      // Người dùng huỷ share
    }
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>SUBTRACK</Text>
            <Text style={styles.title}>Subscriptions</Text>
          </View>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.shareBtn, pressed && styles.shareBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Chia sẻ SubTracker"
          >
            <Ionicons name="share-outline" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <MonthlySummaryCard
          totalMonthlyVnd={totalMonthlyVnd}
          count={subscriptions.length}
          rateNote={formatRateUpdated(lastUpdated, source)}
        />

        {nearest && <UpcomingReminder subscription={nearest} />}

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Danh sách</Text>
          <Text style={styles.listSort}>Sắp xếp theo ngày tới hạn</Text>
        </View>

        {sorted.map((sub) => (
          <SubscriptionCard
            key={sub.id}
            subscription={sub}
            onPress={() => onSelect(sub)}
          />
        ))}

        {subscriptions.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Chưa có gói cước nào</Text>
            <Text style={styles.emptyText}>
              Thêm subscription đầu tiên để bắt đầu theo dõi chi phí hàng tháng.
            </Text>
          </View>
        )}

        <DonateFooter />

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View
        pointerEvents="box-none"
        style={[styles.fabContainer, { bottom: insets.bottom + spacing.lg }]}
      >
        <Pressable
          onPress={onAdd}
          style={({ pressed }) => [
            styles.fab,
            fabElevation,
            pressed && fabElevationPressed,
            pressed && styles.fabPressed,
          ]}
          accessibilityLabel="Thêm subscription"
        >
          <Ionicons name="add" size={22} color={colors.black} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    ...Platform.select({
      web: { maxWidth: 430, alignSelf: 'center', width: '100%' },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xxl,
  },
  eyebrow: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'fonts.medium',
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontFamily: 'fonts.bold',
    letterSpacing: -0.5,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  shareBtnPressed: {
    opacity: 0.85,
    backgroundColor: colors.surfaceElevated,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  listTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontFamily: 'fonts.semiBold',
  },
  listSort: {
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'fonts.regular',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.sm,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: 'fonts.semiBold',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: 'fonts.regular',
    textAlign: 'center',
    maxWidth: 260,
  },
  bottomSpacer: {
    height: 88,
  },
  fabContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  fab: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPressed: {
    transform: [{ translateY: 3 }, { scale: 0.92 }],
  },
});
