import type { CurrencyOption } from '@/src/types';

export function formatMoney(
  amount: number,
  currency: Pick<CurrencyOption, 'symbol' | 'code'>,
  options?: { showSign?: boolean }
): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const sign =
    options?.showSign && amount !== 0 ? (amount > 0 ? '+' : '-') : amount < 0 ? '-' : '';

  return `${sign}${currency.symbol} ${formatted}`;
}
