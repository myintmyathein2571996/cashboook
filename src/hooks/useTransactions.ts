import { useCallback, useEffect, useState } from 'react';

import { useRefresh } from '@/src/context/RefreshContext';
import {
  getAllTransactions,
  getDashboardSummary,
  getRecentTransactions,
} from '@/src/db/repositories/transactions';
import type { DashboardSummary, Transaction, TransactionType } from '@/src/types';

export function useDashboard() {
  const { refreshKey } = useRefresh();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, recentData] = await Promise.all([
        getDashboardSummary(),
        getRecentTransactions(5),
      ]);
      setSummary(summaryData);
      setRecent(recentData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return { summary, recent, loading, reload: load };
}

export function useTransactions(filter?: TransactionType) {
  const { refreshKey } = useRefresh();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllTransactions(filter);
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  return { transactions, loading, reload: load };
}
