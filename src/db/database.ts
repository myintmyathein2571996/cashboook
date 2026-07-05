import * as SQLite from 'expo-sqlite';

import { DEFAULT_CURRENCY } from '@/src/constants/currencies';
import { CREATE_TABLES_SQL } from '@/src/db/schema';

let dbInstance: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbInstance;
}

export async function initDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  const db = await SQLite.openDatabaseAsync('cashbook.db');
  await db.execAsync(CREATE_TABLES_SQL);

  const existing = await db.getFirstAsync<{ value: string }>(
    'SELECT value FROM settings WHERE key = ?',
    ['currency_code']
  );

  if (!existing) {
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?)', [
      'currency_code',
      DEFAULT_CURRENCY.code,
    ]);
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?)', [
      'currency_symbol',
      DEFAULT_CURRENCY.symbol,
    ]);
  }

  dbInstance = db;
  return db;
}
