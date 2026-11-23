// Données de l'appli, gardées sur le téléphone (AsyncStorage).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

import { EXERCISES, type ExoId, type SessionType } from '@/data/programme';

export type Result = { exo: ExoId; level: number; value: number };
export type Done = { date: string; type: SessionType; min: number; results: Result[] };

export type State = {
  levels: Record<ExoId, number>;
  days: 3 | 4 | 5;
  restExo: 45 | 60;
  sound: boolean;
  voice: boolean;
  history: Done[];
  /** Records au premier tour, par exercice et par niveau (« pompes:1 » → 12) */
  best: Record<string, number>;
};

const KEY = 'calisthenie:v1';

const initial: State = {
  // Départ au niveau le plus bas partout : on commence doucement
  levels: Object.fromEntries(EXERCISES.map((e) => [e.id, 0])) as Record<ExoId, number>,
  days: 3,
  restExo: 45,
  sound: true,
  voice: true,
  history: [],
  best: {},
};

type Ctx = { state: State; ready: boolean; update: (fn: (s: State) => State) => void };
const StoreCtx = createContext<Ctx>({ state: initial, ready: false, update: () => {} });

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) setState({ ...initial, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);
  const update = useCallback((fn: (s: State) => State) => {
    setState((s) => {
      const next = fn(s);
      AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);
  return <StoreCtx.Provider value={{ state, ready, update }}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);

export const bestKey = (exo: ExoId, level: number) => `${exo}:${level}`;
