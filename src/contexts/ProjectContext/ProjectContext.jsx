import React, { useState, useContext, createContext } from 'react';

const ProjectContext  = createContext();

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState({});

  return (
    <ProjectContext.Provider value={{ setCurrentProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);

  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }

  return context;
};