/**
 * ConfettiContext
 * Provides app-wide confetti trigger functionality
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import Confetti from '../components/Confetti';

const ConfettiContext = createContext(null);

export const useConfetti = () => {
  const context = useContext(ConfettiContext);
  if (!context) {
    throw new Error('useConfetti must be used within a ConfettiProvider');
  }
  return context;
};

export const ConfettiProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);

  const triggerConfetti = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleComplete = useCallback(() => {
    setIsActive(false);
  }, []);

  return (
    <ConfettiContext.Provider value={{ triggerConfetti, isActive }}>
      {children}
      <Confetti isActive={isActive} onComplete={handleComplete} />
    </ConfettiContext.Provider>
  );
};

export default ConfettiContext;
