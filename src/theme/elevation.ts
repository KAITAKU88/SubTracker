import { Platform, ViewStyle } from 'react-native';

const colorsPrimaryShadow = '#9D7BFF';

export const cardElevation: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
  },
  android: {
    elevation: 8,
  },
  default: {
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
  },
}) as ViewStyle;

export const cardElevationPressed: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
  },
  android: {
    elevation: 2,
  },
  default: {
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.18)',
  },
}) as ViewStyle;

export const fabElevation: ViewStyle = Platform.select({
  ios: {
    shadowColor: colorsPrimaryShadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
  },
  android: {
    elevation: 10,
  },
  default: {
    boxShadow: '0 8px 24px rgba(157, 123, 255, 0.45)',
  },
}) as ViewStyle;

export const fabElevationPressed: ViewStyle = Platform.select({
  ios: {
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  android: {
    elevation: 4,
  },
  default: {
    boxShadow: '0 3px 10px rgba(157, 123, 255, 0.3)',
  },
}) as ViewStyle;

export const dropdownElevation: ViewStyle = Platform.select({
  ios: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
  },
  android: {
    elevation: 14,
  },
  default: {
    boxShadow: '0 10px 28px rgba(0, 0, 0, 0.45)',
  },
}) as ViewStyle;

export const sinkPressed: ViewStyle = {
  transform: [{ translateY: 3 }, { scale: 0.97 }],
};
