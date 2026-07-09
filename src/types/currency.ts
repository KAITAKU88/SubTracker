export const CURRENCY_PRIORITY = ['USD', 'VND', 'JPY', 'CNY'] as const;

export type CoreCurrency = (typeof CURRENCY_PRIORITY)[number];
export type Currency = CoreCurrency | 'EUR' | string;

export const currencySymbols: Record<string, string> = {
  USD: '$',
  VND: 'đ',
  JPY: '¥',
  CNY: '¥',
  EUR: '€',
  GBP: '£',
  KRW: '₩',
  SGD: 'S$',
  THB: '฿',
  AUD: 'A$',
  CAD: 'C$',
  HKD: 'HK$',
  TWD: 'NT$',
};

export const currencyLabels: Record<string, string> = {
  USD: 'Đô la Mỹ',
  VND: 'Việt Nam Đồng',
  JPY: 'Yên Nhật',
  CNY: 'Nhân dân tệ',
  EUR: 'Euro',
  GBP: 'Bảng Anh',
  KRW: 'Won Hàn',
  SGD: 'Đô la Singapore',
  THB: 'Baht Thái',
  AUD: 'Đô la Úc',
  CAD: 'Đô la Canada',
  HKD: 'Đô la Hồng Kông',
  TWD: 'Đô la Đài Loan',
};

export function getCurrencySymbol(code: string): string {
  return currencySymbols[code] ?? code;
}

export function getCurrencyLabel(code: string): string {
  return currencyLabels[code] ?? code;
}

export function sortCurrencies(codes: string[]): string[] {
  const priorityIndex = new Map(CURRENCY_PRIORITY.map((c, i) => [c, i]));

  return [...new Set(codes)].sort((a, b) => {
    const pa = priorityIndex.get(a as CoreCurrency);
    const pb = priorityIndex.get(b as CoreCurrency);
    if (pa !== undefined && pb !== undefined) return pa - pb;
    if (pa !== undefined) return -1;
    if (pb !== undefined) return 1;
    return a.localeCompare(b);
  });
}
