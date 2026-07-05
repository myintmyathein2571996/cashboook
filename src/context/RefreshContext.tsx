import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface RefreshContextValue {
  refreshKey: number;
  refresh: () => void;
}

const RefreshContext = createContext<RefreshContextValue | null>(null);

export function RefreshProvider({ children }: { children: ReactNode }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const value = useMemo(() => ({ refreshKey, refresh }), [refreshKey, refresh]);

  return <RefreshContext.Provider value={value}>{children}</RefreshContext.Provider>;
}

export function useRefresh() {
  const ctx = useContext(RefreshContext);
  if (!ctx) {
    throw new Error('useRefresh must be used within RefreshProvider');
  }
  return ctx;
}
