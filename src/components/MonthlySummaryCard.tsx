import React from 'react';
import { fonts } from '../theme/fonts';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, spacing } from '../theme/colors';
import { cardElevation } from '../theme/elevation';
import { formatVnd } from '../utils/format';

interface MonthlySummaryCardProps {
  totalMonthlyVnd: number;
  count: number;
  rateNote?: string;
}

export function MonthlySummaryCard({ totalMonthlyVnd, count, rateNote }: MonthlySummaryCardProps) {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.header}>
          <Ionicons name="wallet-outline" size={16} color="rgba(255,255,255,0.7)" />
          <Text style={styles.label}>Tổng chi phí mỗi tháng</Text>
        </View>
        <Text style={styles.amountPrimary}>
          {formatVnd(totalMonthlyVnd)}
        </Text>
        <Text style={styles.footer}>
          {count} subscription{count !== 1 ? 's' : ''} đang theo dõi
        </Text>
        {rateNote ? <Text style={styles.rateNote}>{rateNote}</Text> : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    ...cardElevation,
  },
  card: {
    borderRadius: radius.lg,
    padding: spacing.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  label: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontFamily: 'fonts.regular',
  },
  amountPrimary: {
    color: colors.white,
    fontSize: 32,
    fontFamily: 'fonts.bold',
    letterSpacing: -0.5,
  },
  footer: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontFamily: 'fonts.regular',
    marginTop: spacing.lg,
  },
  rateNote: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    fontFamily: 'fonts.regular',
    marginTop: spacing.sm,
  },
});
