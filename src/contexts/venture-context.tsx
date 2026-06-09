'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface VentureCtx {
  vi: number;
  setVi: (i: number) => void;
}

const VentureContext = createContext<VentureCtx>({ vi: 0, setVi: () => {} });

export function VentureProvider({ children }: { children: ReactNode }) {
  const [vi, setViState] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('hq-venture');
    if (stored !== null) {
      const n = parseInt(stored, 10);
      if (!isNaN(n) && n >= 0 && n <= 4) setViState(n);
    }
  }, []);

  function setVi(i: number) {
    setViState(i);
    localStorage.setItem('hq-venture', String(i));
  }

  return <VentureContext.Provider value={{ vi, setVi }}>{children}</VentureContext.Provider>;
}

export function useVenture() {
  return useContext(VentureContext);
}
