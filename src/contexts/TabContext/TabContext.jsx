import React, { useState, useContext, createContext, useEffect } from 'react';
import { usePageContext } from '../PageContext';

const TabContext = createContext({
  tabs: [],
  addTab: (tabName) => {},
  removeTab: (tabName) => {},
  clearTabs: () => {}
});

export const TabProvider = ({ children }) => {
  const { pageIndex, pages, pageControls: { setActivePage }, } = usePageContext()
  const [tabs, setTabs] = useState(pageIndex);

  const addTab = (newTab) => {
    setTabs(prevTabs => [...prevTabs, newTab]);
  };

  const removeTab = (tabName) => {
    if (tabs.length <= 1) return;
  
    const index = tabs.indexOf(tabName);

    const newActiveTab = index > 0  ? tabs[index - 1]  : tabs[index + 1] || null;
    
    setTabs(prevTabs => prevTabs.filter(tab => tab !== tabName));
  
    if (newActiveTab) {
      setActivePage(newActiveTab);
    }

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
