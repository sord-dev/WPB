import React, { useState, useContext, createContext } from "react";
import { generateComponentID } from "../../utils";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "../PageContext";

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState({});
  const { setPageData } = usePageContext()
  const navigate = useNavigate();

  const createProject = (projectName, pageName) => {
    if (projects.some((project) => project.projectName === projectName)) {
      return false;
    }

    console.log(projectName, pageName)

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
      activePage: pageName
    };

    setProjects([...projects, newProject]);
    setCurrentProject(newProject);

    setPageData(newProject)

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
