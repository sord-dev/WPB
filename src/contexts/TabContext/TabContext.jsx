import React, { useState, useContext, createContext, useEffect } from 'react';

const TabContext = createContext();

export const TabProvider = ({ children,}) => {
  const [tabs, setTabs] = useState();

  const addTab = (newTab) => {
    setTabs(prevTabs => [...prevTabs, newTab]);
  };

  const removeTab = (tabId) => {
    setTabs(prevTabs => prevTabs.filter(tab => tab.id !== tabId));
  };

  useEffect(() => {
    console.log('TabProvider - Tabs:', tabs);
  }, [tabs]);

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
