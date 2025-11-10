/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext } from 'react';
import { useWellbeing } from '../hooks/useWellbeing';

interface StreakContextType {
  streak: {
    streak: number;
    lastCheckIn: string | null;
  };
  hasCheckedInToday: boolean;
}

const StreakContext = createContext<StreakContextType | null>(null);

export const StreakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { streak, hasCheckedInToday } = useWellbeing();
  
  return (
    <StreakContext.Provider value={{ streak, hasCheckedInToday }}>
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error('useStreak must be used within a StreakProvider');
  }
  return context;
};

export default StreakContext;