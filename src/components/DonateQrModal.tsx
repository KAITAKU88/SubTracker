import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing } from '../theme/colors';
import { DONATE_QR_IMAGE } from '../config/donate';

interface DonateQrModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DonateQrModal({ visible, onClose }: DonateQrModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>Buy my wife a Trà Sữa</Text>
              <Text style={styles.subtitle}>Quét mã MoMo để ủng hộ nhé 🧋</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.qrFrame}>
            <Image source={DONATE_QR_IMAGE} style={styles.qrImage} resizeMode="contain" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const QR_SIZE = 260;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: spacing.xl,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 17,
    fontFamily: 'fonts.semiBold',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    fontFamily: 'fonts.regular',
  },
  closeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrFrame: {
    width: QR_SIZE,
    height: QR_SIZE,
    alignSelf: 'center',
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.background,
  },
  qrImage: {
    width: QR_SIZE,
    height: QR_SIZE,
    ...Platform.select({
      web: { objectFit: 'contain' as const },
    }),
  },
});
