import React from 'react';
import { fonts } from '../theme/fonts';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../theme/colors';
import { Subscription, cycleLabels } from '../types/subscription';
import { RenewalItem } from '../components/RenewalItem';
import { getNextDueDate } from '../utils/subscriptionDates';
import {
  daysUntil,
  formatAmount,
  formatDateVi,
  getInitials,
  getUpcomingRenewals,
} from '../utils/format';

interface DetailScreenProps {
  subscription: Subscription;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function DetailScreen({
  subscription,
  onBack,
  onEdit,
  onDelete,
}: DetailScreenProps) {
  const nextDue = getNextDueDate(subscription);
  const days = daysUntil(nextDue);
  const renewals = getUpcomingRenewals(nextDue, subscription.cycle, 4);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.nav}>
        <Pressable onPress={onBack} hitSlop={12} style={styles.navBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textSecondary} />
        </Pressable>
        <Pressable onPress={onDelete} hitSlop={12} style={styles.navBtn}>
          <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={[styles.avatar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Text style={styles.avatarText}>{getInitials(subscription.name)}</Text>
          </View>
          <Text style={styles.heroName}>{subscription.name}</Text>
          <Text style={styles.heroCycle}>{cycleLabels[subscription.cycle]}</Text>
          <Text style={styles.heroAmount}>
            {formatAmount(subscription.amount, subscription.currency)}
          </Text>
          <View style={styles.dueRow}>
            <Ionicons name="bag-outline" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.dueText}>
              Mua ngày {formatDateVi(subscription.purchaseDate)}
            </Text>
          </View>
          <View style={[styles.dueRow, { marginTop: spacing.xs }]}>
            <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.dueText}>
              Tới hạn {formatDateVi(nextDue)}
            </Text>
            <View style={styles.dueBadge}>
              <Text style={styles.dueBadgeText}>{days}d nữa</Text>
            </View>
          </View>
        </LinearGradient>

        <Pressable style={styles.editBtn} onPress={onEdit}>
          <Ionicons name="pencil" size={16} color={colors.textPrimary} />
          <Text style={styles.editBtnText}>Sửa subscription</Text>
        </Pressable>

        <Text style={styles.sectionTitle}>Gia hạn sắp tới</Text>
        <View style={styles.renewalList}>
          {renewals.map((date, i) => (
            <RenewalItem
              key={date}
              date={date}
              amount={subscription.amount}
              currency={subscription.currency}
              isFirst={i === 0}
            />
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    ...Platform.select({
      web: { maxWidth: 430, alignSelf: 'center', width: '100%' },
    }),
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.xl,
    ...Platform.select({
      web: { maxWidth: 430, alignSelf: 'center', width: '100%' },
    }),
  },
  heroCard: {
    borderRadius: radius.lg,
    padding: spacing.xxl,
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'fonts.bold',
  },
  heroName: {
    color: colors.white,
    fontSize: 22,
    fontFamily: 'fonts.bold',
  },
  heroCycle: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    fontFamily: 'fonts.regular',
    marginTop: 2,
  },
  heroAmount: {
    color: colors.white,
    fontSize: 36,
    fontFamily: 'fonts.bold',
    marginTop: spacing.lg,
    letterSpacing: -1,
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
    flexWrap: 'wrap',
  },
  dueText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontFamily: 'fonts.regular',
  },
  dueBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  dueBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: 'fonts.medium',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  editBtnText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: 'fonts.semiBold',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontFamily: 'fonts.semiBold',
    marginBottom: spacing.md,
  },
  renewalList: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  bottomSpacer: {
    height: spacing.xxxl,
  },
});
