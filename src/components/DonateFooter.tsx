import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { DONATE_URL } from '../config/donate';
import { DonateQrModal } from './DonateQrModal';

export function DonateFooter() {
  const [showQr, setShowQr] = useState(false);

  const handlePress = async () => {
    if (DONATE_URL) {
      try {
        const canOpen = await Linking.canOpenURL(DONATE_URL);
        if (canOpen) {
          await Linking.openURL(DONATE_URL);
          return;
        }
      } catch {
        // fall through to QR modal
      }
    }
    setShowQr(true);
  };

  return (
    <>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        accessibilityRole="button"
        accessibilityLabel="Buy my wife a Trà Sữa"
      >
        <View style={styles.iconWrap}>
          <Text style={styles.teaEmoji} accessibilityLabel="Trà sữa">
            🧋
          </Text>
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.title}>Buy my wife a Trà Sữa</Text>
          <Text style={styles.subtitle}>App free — quét MoMo nếu bạn thấy hữu ích</Text>
        </View>
        <Ionicons name="qr-code-outline" size={16} color={colors.textMuted} />
      </Pressable>

      <DonateQrModal visible={showQr} onClose={() => setShowQr(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xxl,
    ...Platform.select({
      web: { cursor: 'pointer' as const },
    }),
  },
  cardPressed: {
    opacity: 0.85,
    backgroundColor: colors.surfaceElevated,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teaEmoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 14,
    fontFamily: 'fonts.semiBold',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 12,
    fontFamily: 'fonts.regular',
  },
});
