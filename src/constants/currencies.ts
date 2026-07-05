import type { CurrencyOption } from '@/src/types';

export const CURRENCIES: CurrencyOption[] = [
  { code: 'MMK', symbol: 'Ks', name: 'Myanmar Kyat' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

export const DEFAULT_CURRENCY = CURRENCIES[0];
