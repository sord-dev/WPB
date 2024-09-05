import React, { useState, useContext, createContext, useEffect, act } from "react";
import { generateComponentID } from "../../utils";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "../PageContext";
import { useTabContext } from "../TabContext";

const ProjectContext = createContext({
  createProject: (projectName, pageName) => {},
  selectProject: (projectName) => {},
  projects: [],  // will be gained from the users file system
  activeProject: ""
});

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const { setPageData } = usePageContext()
  const { clearTabs, addTab } = useTabContext()
  const navigate = useNavigate();

  const createProject = (projectName, pageName) => {
    if (projects.some((project) => project.projectName === projectName)) {
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
      activePage: pageName
    };

    clearTabs();
    setProjects([...projects, newProject]);
    setPageData(newProject)
    navigate("/builder");

    return true;
  };

  const selectProject = (projectName) => {
    const project = projects.find((project) => project.projectName === projectName);
    clearTabs();
    addTab(project.activePage);
    setPageData(project)
    navigate("/builder");
  };

  useEffect(() => {
    console.log("DEBUG - Project State: ", projects);
  }, [projects]);

  return (
    <ProjectContext.Provider value={{ createProject, projects, selectProject }}>
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
