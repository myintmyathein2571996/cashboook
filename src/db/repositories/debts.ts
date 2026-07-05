import { getDatabase } from '@/src/db/database';
import type { DebtEntry, DebtEntryType, DebtEntryWithPerson } from '@/src/types';

export interface CreateDebtEntryInput {
  person_id: number;
  type: DebtEntryType;
  amount: number;
  note?: string;
  date: string;
}

export async function getDebtEntriesByPerson(personId: number): Promise<DebtEntry[]> {
  const db = await getDatabase();
  return db.getAllAsync<DebtEntry>(
    'SELECT * FROM debt_entries WHERE person_id = ? ORDER BY date DESC, created_at DESC',
    [personId]
  );
}

export async function getAllDebtEntriesWithPerson(): Promise<DebtEntryWithPerson[]> {
  const db = await getDatabase();
  return db.getAllAsync<DebtEntryWithPerson>(
    `SELECT de.*, p.name as person_name
     FROM debt_entries de
     JOIN people p ON p.id = de.person_id
     ORDER BY de.date DESC, de.created_at DESC`
  );
}

export async function getDebtEntryById(id: number): Promise<DebtEntry | null> {
  const db = await getDatabase();
  return db.getFirstAsync<DebtEntry>('SELECT * FROM debt_entries WHERE id = ?', [id]);
}

export async function createDebtEntry(input: CreateDebtEntryInput): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO debt_entries (person_id, type, amount, note, date, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [
      input.person_id,
      input.type,
      input.amount,
      input.note ?? '',
      input.date,
      Date.now(),
    ]
  );
  return result.lastInsertRowId;
}

export async function updateDebtEntry(
  id: number,
  input: CreateDebtEntryInput
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE debt_entries SET person_id = ?, type = ?, amount = ?, note = ?, date = ? WHERE id = ?',
    [input.person_id, input.type, input.amount, input.note ?? '', input.date, id]
  );
}

export async function deleteDebtEntry(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM debt_entries WHERE id = ?', [id]);
}

export function getDebtTypeLabel(type: DebtEntryType): string {
  switch (type) {
    case 'borrowed':
      return 'Borrowed from them';
    case 'lent':
      return 'Lent to them';
    case 'repaid_to':
      return 'You repaid';
    case 'repaid_by':
      return 'They repaid';
  }
}
