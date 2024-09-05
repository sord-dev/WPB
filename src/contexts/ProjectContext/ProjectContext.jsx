import React, { useState, useContext, createContext } from "react";
import { generateComponentID } from "../../utils";
import { useNavigate } from "react-router-dom";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({});
  const navigate = useNavigate();

  const createProject = (projectName, pageName) => {
    if (projects.some((project) => project.name === projectName)) {
      return false;
    }

    const newProject = {
      projectName: projectName,
      pages: {
        [pageName]: {
          content: {
            type: "wrapper",
            props: { id: generateComponentID("wrapper"), children: [] },
          },
        },
      },
      pageIndex: [pageName],
    };

    setProjects([...projects, newProject]);
    setCurrentProject(newProject);

    navigate("/builder");

    return true;
  };

  return (
    <ProjectContext.Provider value={{ createProject, currentProject, setCurrentProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);

  if (context === undefined) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }

  return context;
};
