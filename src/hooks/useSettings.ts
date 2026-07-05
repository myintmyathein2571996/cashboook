import { useCallback, useEffect, useState } from 'react';

import { useRefresh } from '@/src/context/RefreshContext';
import { getCurrency, setCurrency } from '@/src/db/repositories/settings';
import type { CurrencyOption } from '@/src/types';

export function useSettings() {
  const { refreshKey, refresh } = useRefresh();
  const [currency, setCurrencyState] = useState<CurrencyOption | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCurrency();
      setCurrencyState(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const updateCurrency = useCallback(
    async (next: Pick<CurrencyOption, 'code' | 'symbol'>) => {
      await setCurrency(next);
      refresh();
    },
    [refresh]
  );

  return { currency, loading, updateCurrency, reload: load };
}
