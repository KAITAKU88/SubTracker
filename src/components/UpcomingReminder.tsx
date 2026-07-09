import React from 'react';
import { fonts } from '../theme/fonts';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { cardElevation } from '../theme/elevation';
import { Subscription } from '../types/subscription';
import { daysUntil, formatAmount, formatDateVi } from '../utils/format';
import { getNextDueDate } from '../utils/subscriptionDates';

interface UpcomingReminderProps {
  subscription: Subscription;
}

export function UpcomingReminder({ subscription }: UpcomingReminderProps) {
  const nextDue = getNextDueDate(subscription);
  const days = daysUntil(nextDue);

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="calendar-outline" size={18} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>
          {subscription.name} — {days} ngày nữa
        </Text>
        <Text style={styles.subtitle}>
          {formatAmount(subscription.amount, subscription.currency)} · {formatDateVi(nextDue)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...cardElevation,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: 'fonts.semiBold',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: 'fonts.regular',
    marginTop: 2,
  },
});
