import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  Platform,
  LayoutRectangle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, avatarColors } from '../theme/colors';
import { dropdownElevation } from '../theme/elevation';
import { BillingCycle, Subscription } from '../types/subscription';
import { getCurrencyLabel } from '../types/currency';
import { useExchangeRates } from '../context/ExchangeRateContext';
import { DatePickerTrigger, CalendarPanel } from './CalendarPanel';

interface AddSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (sub: Omit<Subscription, 'id' | 'createdAt'>) => void;
  editData?: Subscription | null;
  onUpdate?: (sub: Subscription) => void;
}

type OpenMenu = 'currency' | 'cycle' | 'date' | null;

const cycles: { value: BillingCycle; label: string }[] = [
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'quarterly', label: 'Hàng quý' },
  { value: 'yearly', label: 'Hàng năm' },
];

const CURRENCY_MENU_MAX_HEIGHT = 220;

export function AddSubscriptionModal({
  visible,
  onClose,
  onAdd,
  editData,
  onUpdate,
}: AddSubscriptionModalProps) {
  const { availableCurrencies } = useExchangeRates();
  const currencyOptions =
    availableCurrencies.length > 0 ? availableCurrencies : ['USD', 'VND', 'JPY', 'CNY'];

  const sheetRef = useRef<View>(null);
  const currencyAnchorRef = useRef<View>(null);
  const cycleAnchorRef = useRef<View>(null);
  const dateAnchorRef = useRef<View>(null);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [color, setColor] = useState<string>(avatarColors[0]);
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [menuRect, setMenuRect] = useState<LayoutRectangle | null>(null);

  const closePickers = useCallback(() => {
    setOpenMenu(null);
    setMenuRect(null);
  }, []);

  const measureAndToggle = useCallback(
    (menu: OpenMenu, anchorRef: React.RefObject<View | null>) => {
      if (openMenu === menu) {
        closePickers();
        return;
      }

      const anchor = anchorRef.current;
      const sheet = sheetRef.current;
      if (!anchor || !sheet) return;

      const applyRect = (left: number, top: number, width: number, height: number) => {
        setMenuRect({ x: left, y: top + height + spacing.xs, width, height: 0 });
        setOpenMenu(menu);
      };

      if (Platform.OS === 'web') {
        anchor.measureInWindow((x, y, width, height) => {
          sheet.measureInWindow((sx, sy) => {
            applyRect(x - sx, y - sy, width, height);
          });
        });
        return;
      }

      anchor.measureLayout(
        sheet,
        (left, top, width, height) => applyRect(left, top, width, height),
        () => closePickers()
      );
    },
    [openMenu, closePickers]
  );

  const handleClose = () => {
    closePickers();
    onClose();
  };

  React.useEffect(() => {
    if (editData) {
      setName(editData.name);
      setAmount(String(editData.amount));
      setCurrency(editData.currency);
      setCycle(editData.cycle);
      setPurchaseDate(editData.purchaseDate);
      setColor(editData.color);
    } else if (visible) {
      setName('');
      setAmount('');
      setCurrency('USD');
      setCycle('monthly');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setColor(avatarColors[0]);
      closePickers();
    }
  }, [editData, visible, closePickers]);

  const handleSubmit = () => {
    if (!name.trim() || !amount) return;
    const data = {
      name: name.trim(),
      amount: parseFloat(amount),
      currency,
      cycle,
      purchaseDate,
      color,
    };
    if (editData && onUpdate) {
      const purchaseChanged = editData.purchaseDate !== purchaseDate;
      onUpdate({
        ...editData,
        ...data,
        lastPaidDate: purchaseChanged ? undefined : editData.lastPaidDate,
      });
    } else {
      onAdd(data);
    }
    onClose();
  };

  const selectCurrency = (code: string) => {
    setCurrency(code);
    closePickers();
  };

  const selectCycle = (value: BillingCycle) => {
    setCycle(value);
    closePickers();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View ref={sheetRef} style={styles.sheet} collapsable={false}>
          {openMenu && <Pressable style={styles.pickerBackdrop} onPress={closePickers} />}

          <View style={styles.header}>
            <Text style={styles.title}>
              {editData ? 'Sửa subscription' : 'Thêm subscription'}
            </Text>
            <Pressable onPress={handleClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={closePickers}
          >
            <Text style={styles.label}>Tên dịch vụ</Text>
            <TextInput
              style={[styles.input, name.length > 0 && styles.inputFocused]}
              placeholder="Netflix, Spotify..."
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              onFocus={closePickers}
            />

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Số tiền</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                  onFocus={closePickers}
                />
              </View>
              <View style={styles.half}>
                <Text style={styles.label}>Tiền tệ</Text>
                <View ref={currencyAnchorRef} collapsable={false}>
                  <Pressable
                    style={[styles.select, openMenu === 'currency' && styles.selectActive]}
                    onPress={() => measureAndToggle('currency', currencyAnchorRef)}
                  >
                    <Text style={styles.selectText} numberOfLines={1}>
                      {currency}
                    </Text>
                    <Ionicons
                      name={openMenu === 'currency' ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.half}>
                <Text style={styles.label}>Chu kỳ</Text>
                <View ref={cycleAnchorRef} collapsable={false}>
                  <Pressable
                    style={[styles.select, openMenu === 'cycle' && styles.selectActive]}
                    onPress={() => measureAndToggle('cycle', cycleAnchorRef)}
                  >
                    <Text style={styles.selectText} numberOfLines={1}>
                      {cycles.find((c) => c.value === cycle)?.label}
                    </Text>
                    <Ionicons
                      name={openMenu === 'cycle' ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </View>
              </View>
              <View style={styles.half}>
                <View ref={dateAnchorRef} collapsable={false}>
                  <DatePickerTrigger
                    label="Ngày mua"
                    value={purchaseDate}
                    active={openMenu === 'date'}
                    onPress={() => measureAndToggle('date', dateAnchorRef)}
                  />
                </View>
              </View>
            </View>

            <Text style={styles.label}>Màu</Text>
            <View style={styles.colorRow}>
              {avatarColors.map((c) => (
                <Pressable
                  key={c}
                  style={[styles.colorSwatch, { backgroundColor: c }]}
                  onPress={() => setColor(c)}
                >
                  {color === c && (
                    <Ionicons name="checkmark" size={16} color={colors.white} />
                  )}
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {openMenu && menuRect && (
            <View
              style={[
                styles.floatingMenu,
                {
                  top: menuRect.y,
                  left: menuRect.x,
                  width: menuRect.width,
                },
              ]}
            >
              {openMenu === 'currency' && (
                <ScrollView
                  style={styles.currencyScroll}
                  contentContainerStyle={styles.currencyScrollContent}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="always"
                  showsVerticalScrollIndicator
                >
                  {currencyOptions.map((c) => (
                    <Pressable
                      key={c}
                      style={styles.pickerItem}
                      onPress={() => selectCurrency(c)}
                    >
                      <Text
                        style={[styles.pickerText, currency === c && styles.pickerActive]}
                        numberOfLines={1}
                      >
                        {c} · {getCurrencyLabel(c)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              {openMenu === 'cycle' &&
                cycles.map((c) => (
                  <Pressable
                    key={c.value}
                    style={styles.pickerItem}
                    onPress={() => selectCycle(c.value)}
                  >
                    <Text
                      style={[styles.pickerText, cycle === c.value && styles.pickerActive]}
                      numberOfLines={1}
                    >
                      {c.label}
                    </Text>
                  </Pressable>
                ))}

              {openMenu === 'date' && (
                <CalendarPanel
                  value={purchaseDate}
                  onChange={setPurchaseDate}
                  onClose={closePickers}
                />
              )}
            </View>
          )}

          <View style={styles.actions}>
            <Pressable onPress={handleClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Huỷ</Text>
            </Pressable>
            <Pressable style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>{editData ? 'Lưu' : 'Thêm'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.overlay,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    zIndex: 2,
    width: '100%',
    ...Platform.select({
      web: { maxWidth: 420, alignSelf: 'center', width: '100%' },
    }),
  },
  pickerBackdrop: {
    ...StyleSheet.absoluteFill,
    zIndex: 50,
  },
  floatingMenu: {
    position: 'absolute',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    overflow: 'hidden',
    zIndex: 100,
    ...dropdownElevation,
  },
  currencyScroll: Platform.select({
    web: {
      maxHeight: CURRENCY_MENU_MAX_HEIGHT,
      overflowY: 'auto' as const,
    },
    default: {
      maxHeight: CURRENCY_MENU_MAX_HEIGHT,
    },
  }),
  currencyScrollContent: {
    paddingVertical: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    zIndex: 20,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontFamily: 'fonts.bold',
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: 'fonts.regular',
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    fontSize: 15,
    fontFamily: 'fonts.regular',
  },
  inputFocused: {
    borderColor: colors.inputFocus,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    alignItems: 'flex-start',
  },
  half: {
    flex: 1,
    minWidth: 0,
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
  pickerItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  pickerText: {
    color: colors.textSecondary,
    fontFamily: 'fonts.regular',
    fontSize: 13,
  },
  pickerActive: {
    color: colors.primary,
    fontFamily: 'fonts.semiBold',
  },
  colorRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.xl,
    zIndex: 20,
  },
  cancelBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontFamily: 'fonts.medium',
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.pill,
  },
  submitText: {
    color: colors.black,
    fontSize: 15,
    fontFamily: 'fonts.bold',
  },
});
