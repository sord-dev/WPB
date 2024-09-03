import React, { useState, useContext, createContext, useEffect } from 'react';
import { usePageContext } from '../PageContext';

const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const { pageIndex, pages } = usePageContext()
  const [tabs, setTabs] = useState(pageIndex);

  const addTab = (newTab) => {
    setTabs(prevTabs => [...prevTabs, newTab]);
  };

  const removeTab = (tabName) => {
    setTabs(prevTabs => prevTabs.filter(tab => tab !== tabName));
  };

  return (
    <TabContext.Provider value={{ tabs, addTab, removeTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  const context = useContext(TabContext);

  if (context === undefined) {
    throw new Error('useTabContext must be used within a TabProvider');
  }

  return context;
};
