import { getDatabase } from '@/src/db/database';
import { DEFAULT_CURRENCY } from '@/src/constants/currencies';
import type { CurrencyOption } from '@/src/types';

export async function getCurrency(): Promise<CurrencyOption> {
  const db = await getDatabase();
  const codeRow = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    ['currency_code']
  );
  const symbolRow = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    ['currency_symbol']
  );

  return {
    code: codeRow?.value ?? DEFAULT_CURRENCY.code,
    symbol: symbolRow?.value ?? DEFAULT_CURRENCY.symbol,
    name: '',
  };
}

export async function setCurrency(currency: Pick<CurrencyOption, 'code' | 'symbol'>): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    ['currency_code', currency.code]
  );
  await db.runAsync(
    'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
    ['currency_symbol', currency.symbol]
  );
}
