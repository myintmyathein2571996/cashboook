import { getDatabase } from '@/src/db/database';
import type { DashboardSummary, Transaction, TransactionType } from '@/src/types';
import { getMonthRange } from '@/src/utils/dates';

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: string;
}

export async function getAllTransactions(
  filter?: TransactionType
): Promise<Transaction[]> {
  const db = await getDatabase();
  if (filter) {
    return db.getAllAsync<Transaction>(
      'SELECT * FROM transactions WHERE type = ? ORDER BY date DESC, created_at DESC',
      [filter]
    );
  }
  return db.getAllAsync<Transaction>(
    'SELECT * FROM transactions ORDER BY date DESC, created_at DESC'
  );
}

export async function getRecentTransactions(limit = 5): Promise<Transaction[]> {
  const db = await getDatabase();
  return db.getAllAsync<Transaction>(
    'SELECT * FROM transactions ORDER BY date DESC, created_at DESC LIMIT ?',
    [limit]
  );
}

export async function getTransactionById(id: number): Promise<Transaction | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Transaction>('SELECT * FROM transactions WHERE id = ?', [id]);
}

export async function createTransaction(
  input: CreateTransactionInput
): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO transactions (type, amount, category, note, date, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [
      input.type,
      input.amount,
      input.category,
      input.note ?? '',
      input.date,
      Date.now(),
    ]
  );
  return result.lastInsertRowId;
}

export async function updateTransaction(
  id: number,
  input: CreateTransactionInput
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE transactions SET type = ?, amount = ?, category = ?, note = ?, date = ? WHERE id = ?',
    [input.type, input.amount, input.category, input.note ?? '', input.date, id]
  );
}

export async function deleteTransaction(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const db = await getDatabase();
  const { start, end } = getMonthRange();

  const totals = await db.getFirstAsync<{ income: number; expense: number }>(
    `SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
    FROM transactions`
  );

  const monthTotals = await db.getFirstAsync<{ income: number; expense: number }>(
    `SELECT
      COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
      COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
    FROM transactions WHERE date >= ? AND date <= ?`,
    [start, end]
  );

  const debtBalances = await db.getAllAsync<{ person_id: number; balance: number }>(
    `SELECT person_id,
      SUM(CASE
        WHEN type = 'lent' OR type = 'repaid_by' THEN amount
        WHEN type = 'borrowed' OR type = 'repaid_to' THEN -amount
        ELSE 0
      END) as balance
    FROM debt_entries
    GROUP BY person_id`
  );

  let totalYouOwe = 0;
  let totalOwedToYou = 0;
  for (const row of debtBalances) {
    if (row.balance < 0) totalYouOwe += Math.abs(row.balance);
    if (row.balance > 0) totalOwedToYou += row.balance;
  }

  const income = totals?.income ?? 0;
  const expense = totals?.expense ?? 0;
  const monthIncome = monthTotals?.income ?? 0;
  const monthExpense = monthTotals?.expense ?? 0;

  return {
    totalBalance: income - expense,
    monthIncome,
    monthExpense,
    monthNet: monthIncome - monthExpense,
    totalYouOwe,
    totalOwedToYou,
  };
}
