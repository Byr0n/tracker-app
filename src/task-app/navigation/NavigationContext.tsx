import React, { createContext, useContext, useState } from 'react';
import { Screen, NavigationState } from '../types';

interface NavigationContextType {
  state: NavigationState;
  navigate: (screen: Screen, params?: NavigationState['params']) => void;
  goBack: () => void;
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<NavigationState[]>([{ screen: 'Home' }]);
  const state = history[history.length - 1];

  const navigate = (screen: Screen, params?: NavigationState['params']) => {
    setHistory(prev => [...prev, { screen, params }]);
  };

  const goBack = () => {
    setHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  return (
    <NavigationContext.Provider
      value={{ state, navigate, goBack, canGoBack: history.length > 1 }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextType {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}
