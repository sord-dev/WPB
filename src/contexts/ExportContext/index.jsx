import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Create a new context with a default value
const ExportContext = createContext({
    exportedData: {dat: null, type: null},
    display: (exportedData, type) => {}
});

// Create a provider component
export const ExportContextProvider = ({ children }) => {
  const [exportedData, setExportedData] = useState({dat: null, type: null});
  const navigate = useNavigate();

  const display = (exportedData, type) => {
    setExportedData({dat: exportedData, type: type});
    navigate('/testing');
  };

  return (
    <ExportContext.Provider value={{ exportedData, display }}>
      {children}
    </ExportContext.Provider>
  );
};

// Create a custom hook to use the new context
export const useExportContext = () => {
  const context = useContext(ExportContext);
  if (context === undefined) {
    throw new Error('useExportContext must be used within a ExportContextProvider');
  }
  return context;
};
