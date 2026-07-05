import { useCallback, useEffect, useState } from 'react';

import { useRefresh } from '@/src/context/RefreshContext';
import { getDebtEntriesByPerson } from '@/src/db/repositories/debts';
import {
  getAllPeopleWithBalance,
  getPersonBalance,
  getPersonById,
} from '@/src/db/repositories/people';
import type { DebtEntry, Person, PersonWithBalance } from '@/src/types';

export function usePeople() {
  const { refreshKey } = useRefresh();
  const [people, setPeople] = useState<PersonWithBalance[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllPeopleWithBalance();
      setPeople(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return { people, loading, reload: load };
}

export function usePerson(personId: number) {
  const { refreshKey } = useRefresh();
  const [person, setPerson] = useState<Person | null>(null);
  const [balance, setBalance] = useState(0);
  const [entries, setEntries] = useState<DebtEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [personData, balanceData, entriesData] = await Promise.all([
        getPersonById(personId),
        getPersonBalance(personId),
        getDebtEntriesByPerson(personId),
      ]);
      setPerson(personData);
      setBalance(balanceData);
      setEntries(entriesData);
    } finally {
      setLoading(false);
    }
  }, [personId]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return { person, balance, entries, loading, reload: load };
}
