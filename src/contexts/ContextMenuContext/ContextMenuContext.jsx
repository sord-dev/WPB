import React, { useState, useContext, createContext } from "react";

const ContextMenuContext = createContext({
  activeCard: null,
  setActiveCard: () => {},
  points: { x: 0, y: 0 },
  setPoints: () => {},
});

export const ContextMenuProvider = ({ children }) => {
  const [activeCard, setActiveCard] = useState(null);
  const [points, setPoints] = useState({ x: 0, y: 0 });

  return (
    <ContextMenuContext.Provider
      value={{ activeCard, setActiveCard, points, setPoints }}
    >
      {children}
    </ContextMenuContext.Provider>
  );
};

export const useContextMenu = () => {
  const context = useContext(ContextMenuContext);

  if (context === undefined) {
    throw new Error("useContextMenu must be used within a ProjectProvider");
  }

  return context;
};
