import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { initDatabase } from '@/src/db/database';

interface DatabaseContextValue {
  isReady: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextValue>({
  isReady: false,
  error: null,
});

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => setIsReady(true))
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))));
  }, []);

  if (error) {
    throw error;
  }

  return (
    <DatabaseContext.Provider value={{ isReady, error }}>
      {isReady ? children : null}
    </DatabaseContext.Provider>
  );
}

export function useDatabaseReady() {
  return useContext(DatabaseContext);
}
