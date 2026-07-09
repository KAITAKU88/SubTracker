import { Platform } from 'react-native';

export const fonts = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }) as string,
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }) as string,
  semiBold: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }) as string,
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }) as string,
};
