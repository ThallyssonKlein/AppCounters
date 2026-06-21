import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Counter} from '../types/Counter';

const STORAGE_KEY = '@app_counters/counters';

type CountersContextValue = {
  counters: Counter[];
  isLoading: boolean;
  addCounter: (name: string) => void;
  removeCounter: (id: string) => void;
  renameCounter: (id: string, name: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  resetAll: () => void;
};

const CountersContext = createContext<CountersContextValue | undefined>(
  undefined,
);

export function CountersProvider({children}: {children: React.ReactNode}) {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(stored => {
        if (stored) {
          setCounters(JSON.parse(stored));
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(counters));
    }
  }, [counters, isLoading]);

  const addCounter = useCallback((name: string) => {
    setCounters(prev => [
      ...prev,
      {id: Date.now().toString(), name, value: 0},
    ]);
  }, []);

  const removeCounter = useCallback((id: string) => {
    setCounters(prev => prev.filter(counter => counter.id !== id));
  }, []);

  const renameCounter = useCallback((id: string, name: string) => {
    setCounters(prev =>
      prev.map(counter => (counter.id === id ? {...counter, name} : counter)),
    );
  }, []);

  const increment = useCallback((id: string) => {
    setCounters(prev =>
      prev.map(counter =>
        counter.id === id ? {...counter, value: counter.value + 1} : counter,
      ),
    );
  }, []);

  const decrement = useCallback((id: string) => {
    setCounters(prev =>
      prev.map(counter =>
        counter.id === id
          ? {...counter, value: Math.max(0, counter.value - 1)}
          : counter,
      ),
    );
  }, []);

  const resetAll = useCallback(() => {
    setCounters(prev => prev.map(counter => ({...counter, value: 0})));
  }, []);

  const value = useMemo(
    () => ({
      counters,
      isLoading,
      addCounter,
      removeCounter,
      renameCounter,
      increment,
      decrement,
      resetAll,
    }),
    [
      counters,
      isLoading,
      addCounter,
      removeCounter,
      renameCounter,
      increment,
      decrement,
      resetAll,
    ],
  );

  return (
    <CountersContext.Provider value={value}>
      {children}
    </CountersContext.Provider>
  );
}

export function useCounters() {
  const context = useContext(CountersContext);
  if (!context) {
    throw new Error('useCounters must be used within a CountersProvider');
  }
  return context;
}
