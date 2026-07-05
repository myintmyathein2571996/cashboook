import { getDatabase } from '@/src/db/database';
import type { Person, PersonWithBalance } from '@/src/types';

export interface CreatePersonInput {
  name: string;
  note?: string;
}

function balanceSql(alias = 'p'): string {
  return `(
    SELECT COALESCE(SUM(
      CASE
        WHEN de.type = 'lent' OR de.type = 'repaid_by' THEN de.amount
        WHEN de.type = 'borrowed' OR de.type = 'repaid_to' THEN -de.amount
        ELSE 0
      END
    ), 0)
    FROM debt_entries de
    WHERE de.person_id = ${alias}.id
  )`;
}

export async function getAllPeopleWithBalance(): Promise<PersonWithBalance[]> {
  const db = await getDatabase();
  return db.getAllAsync<PersonWithBalance>(
    `SELECT p.*, ${balanceSql('p')} as balance
     FROM people p
     ORDER BY ABS(${balanceSql('p')}) DESC, p.name ASC`
  );
}

export async function getPersonById(id: number): Promise<Person | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Person>('SELECT * FROM people WHERE id = ?', [id]);
}

export async function getPersonBalance(personId: number): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ balance: number }>(
    `SELECT COALESCE(SUM(
      CASE
        WHEN type = 'lent' OR type = 'repaid_by' THEN amount
        WHEN type = 'borrowed' OR type = 'repaid_to' THEN -amount
        ELSE 0
      END
    ), 0) as balance
    FROM debt_entries WHERE person_id = ?`,
    [personId]
  );
  return row?.balance ?? 0;
}

export async function createPerson(input: CreatePersonInput): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    'INSERT INTO people (name, note, created_at) VALUES (?, ?, ?)',
    [input.name.trim(), input.note ?? '', Date.now()]
  );
  return result.lastInsertRowId;
}

export async function updatePerson(
  id: number,
  input: CreatePersonInput
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('UPDATE people SET name = ?, note = ? WHERE id = ?', [
    input.name.trim(),
    input.note ?? '',
    id,
  ]);
}

export async function deletePerson(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM people WHERE id = ?', [id]);
}
