import React from 'react';
import { fonts } from '../theme/fonts';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme/colors';
import { formatAmount } from '../utils/format';
import {
  formatDateLongVi,
  formatMonthShort,
  getDay,
  daysUntil,
} from '../utils/format';

interface RenewalItemProps {
  date: string;
  amount: number;
  currency: string;
  isFirst?: boolean;
}

export function RenewalItem({ date, amount, currency, isFirst }: RenewalItemProps) {
  const days = daysUntil(date);

  return (
    <View style={styles.row}>
      <View style={styles.dateBlock}>
        <Text style={styles.month}>{formatMonthShort(date)}</Text>
        <Text style={styles.day}>{getDay(date)}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.dateText}>{formatDateLongVi(date)}</Text>
        <Text style={styles.subtext}>
          {isFirst ? `Kỳ tiếp theo · ${days}d nữa` : 'Kỳ tiếp theo'}
        </Text>
      </View>
      <Text style={styles.amount}>{formatAmount(amount, currency)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    gap: spacing.md,
  },
  dateBlock: {
    width: 48,
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
  },
  month: {
    color: colors.textSecondary,
    fontSize: 10,
    fontFamily: 'fonts.medium',
    letterSpacing: 0.5,
  },
  day: {
    color: colors.textPrimary,
    fontSize: 20,
    fontFamily: 'fonts.bold',
  },
  content: {
    flex: 1,
  },
  dateText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: 'fonts.medium',
  },
  subtext: {
    color: colors.textSecondary,
    fontSize: 12,
    fontFamily: 'fonts.regular',
    marginTop: 2,
  },
  amount: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: 'fonts.semiBold',
  },
});
