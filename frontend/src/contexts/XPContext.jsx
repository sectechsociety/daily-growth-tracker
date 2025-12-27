import React, { createContext, useState } from "react";

export const XPContext = createContext();

export const XPProvider = ({ children }) => {
  const [xp, setXp] = useState(0);

  const addXp = (amount) => setXp((prev) => prev + amount);

  return (
    <XPContext.Provider value={{ xp, addXp }}>
      {children}
    </XPContext.Provider>
  );
};
