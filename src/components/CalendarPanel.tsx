import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { formatDateVi } from '../utils/format';

interface DatePickerTriggerProps {
  value: string;
  label?: string;
  active?: boolean;
  onPress: () => void;
}

export function DatePickerTrigger({ value, label, active, onPress }: DatePickerTriggerProps) {
  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={[styles.select, active && styles.selectActive]} onPress={onPress}>
        <Text style={styles.selectText} numberOfLines={1}>
          {formatDateVi(value)}
        </Text>
        <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

interface CalendarPanelProps {
  value: string;
  onChange: (date: string) => void;
  onClose: () => void;
}

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function toDateStr(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

function parseDate(value: string) {
  const d = new Date(value + 'T00:00:00');
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
}

function buildCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells: { day: number; month: number; year: number; inMonth: boolean }[] = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = daysInPrev - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({ day, month: prevMonth, year: prevYear, inMonth: false });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, month, year, inMonth: true });
  }

  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    cells.push({ day: nextDay, month: nextMonth, year: nextYear, inMonth: false });
    nextDay++;
  }

  return cells;
}

export function CalendarPanel({ value, onChange, onClose }: CalendarPanelProps) {
  const parsed = parseDate(value);
  const [viewYear, setViewYear] = useState(parsed.year);
  const [viewMonth, setViewMonth] = useState(parsed.month);

  const monthLabel = useMemo(
    () =>
      new Date(viewYear, viewMonth, 1).toLocaleDateString('vi-VN', {
        month: 'long',
        year: 'numeric',
      }),
    [viewYear, viewMonth]
  );

  const cells = useMemo(() => buildCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectDay = (year: number, month: number, day: number) => {
    onChange(toDateStr(year, month, day));
    onClose();
  };

  return (
    <View style={styles.calendar}>
      <View style={styles.calendarHeader}>
        <Pressable onPress={goPrevMonth} hitSlop={8}>
          <Ionicons name="chevron-back" size={18} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.monthLabel}>{monthLabel}</Text>
        <Pressable onPress={goNextMonth} hitSlop={8}>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAYS.map((d) => (
          <Text key={d} style={styles.weekday}>
            {d}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell, index) => {
          const dateStr = toDateStr(cell.year, cell.month, cell.day);
          const isSelected = dateStr === value;
          return (
            <Pressable
              key={`${dateStr}-${index}`}
              style={[styles.dayCell, isSelected && styles.daySelected]}
              onPress={() => selectDay(cell.year, cell.month, cell.day)}
            >
              <Text
                style={[
                  styles.dayText,
                  !cell.inMonth && styles.dayMuted,
                  isSelected && styles.dayTextSelected,
                ]}
              >
                {cell.day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: 'fonts.regular',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  select: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectActive: {
    borderColor: colors.inputFocus,
  },
  selectText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: 'fonts.regular',
    flex: 1,
    marginRight: spacing.sm,
  },
  calendar: {
    padding: spacing.md,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  monthLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: 'fonts.semiBold',
    textTransform: 'capitalize',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 11,
    fontFamily: 'fonts.medium',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  daySelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontFamily: 'fonts.regular',
  },
  dayMuted: {
    color: colors.textMuted,
  },
  dayTextSelected: {
    color: colors.black,
    fontFamily: 'fonts.bold',
  },
});
