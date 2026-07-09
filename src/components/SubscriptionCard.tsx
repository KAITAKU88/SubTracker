import React from 'react';
import { fonts } from '../theme/fonts';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { cardElevation, cardElevationPressed, sinkPressed } from '../theme/elevation';
import { cycleLabels, Subscription } from '../types/subscription';
import { daysUntil, formatAmount, getInitials } from '../utils/format';
import { getNextDueDate } from '../utils/subscriptionDates';

interface SubscriptionCardProps {
  subscription: Subscription;
  onPress: () => void;
}

export function SubscriptionCard({ subscription, onPress }: SubscriptionCardProps) {
  const nextDue = getNextDueDate(subscription);
  const days = daysUntil(nextDue);
  const isUrgent = days <= 7;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        cardElevation,
        pressed && cardElevationPressed,
        pressed && sinkPressed,
      ]}
    >
      <View style={[styles.avatar, { backgroundColor: subscription.color }]}>
        <Text style={styles.avatarText}>{getInitials(subscription.name)}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{subscription.name}</Text>
          <View style={[styles.badge, isUrgent ? styles.badgeUrgent : styles.badgeNormal]}>
            <Text style={[styles.badgeText, isUrgent ? styles.badgeTextUrgent : styles.badgeTextNormal]}>
              {days}d nữa
            </Text>
          </View>
        </View>
        <Text style={styles.meta}>
          {formatAmount(subscription.amount, subscription.currency)} · {cycleLabels[subscription.cycle]}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'fonts.bold',
  },
  content: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  name: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: 'fonts.semiBold',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
  },
  badgeUrgent: {
    backgroundColor: colors.urgentBg,
  },
  badgeNormal: {
    backgroundColor: colors.surfaceElevated,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'fonts.medium',
  },
  badgeTextUrgent: {
    color: colors.urgent,
  },
  badgeTextNormal: {
    color: colors.textSecondary,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: 'fonts.regular',
    marginTop: 2,
  },
});
