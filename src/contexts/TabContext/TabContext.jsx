import React, { useState, useContext, createContext, useEffect } from 'react';
import { usePageContext } from '../PageContext';

const TabContext = createContext({
  tabs: [],
  addTab: (tabName) => {},
  removeTab: (tabName) => {},
  clearTabs: () => {}
});

export const TabProvider = ({ children }) => {
  const { pageIndex, pages } = usePageContext()
  const [tabs, setTabs] = useState(pageIndex);

  const addTab = (newTab) => {
    setTabs(prevTabs => [...prevTabs, newTab]);
  };

  const removeTab = (tabName) => {
    setTabs(prevTabs => prevTabs.filter(tab => tab !== tabName));
  };

  const clearTabs = () => {
    console.log('clearing tabs')
    setTabs([]);
  };

  useEffect(() => {
    console.log('tabs', tabs)
    console.log('pages', pages)
  }, [pages, tabs])

  return (
    <TabContext.Provider value={{ tabs, addTab, removeTab, clearTabs }}>
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
