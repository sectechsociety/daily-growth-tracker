import { createContext, useContext, useMemo } from 'react';
import { useXP } from '../hooks/useXP';

const XPContext = createContext(null);

export const XPProvider = ({ user, setUser, children }) => {
  const xpState = useXP(user, setUser);

  const value = useMemo(() => xpState, [xpState]);

  return (
    <XPContext.Provider value={value}>
      {children}
    </XPContext.Provider>
  );
};

export const useXPContext = () => {
  const context = useContext(XPContext);

  if (!context) {
    throw new Error('useXPContext must be used within an XPProvider');
  }

  return context;
};
