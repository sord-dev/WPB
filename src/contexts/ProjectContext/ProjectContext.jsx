import React, { useState, useContext, createContext, useEffect } from "react";
import { generateComponentID } from "../../utils";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "../PageContext";
import { useTabContext } from "../TabContext";
import { invoke } from "@tauri-apps/api";

const ProjectContext = createContext({
  createProject: (projectName, pageName) => {},
  selectProject: (projectName) => {},
  loadProjects: () => {},
  updateProjectPage: (filePath, updatedPage)=> {},
  projects: [],  // will be gained from the users file system
  activeProject: ""
});

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const { setPageData } = usePageContext()
  const { clearTabs, addTab } = useTabContext()
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState("");

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
    setActiveProject(projectName);
    setPageData(project)
    navigate("/builder");
  };

  const loadProjects = async () => {
    try {
      const loadedProjects = await invoke("scan_for_projects")
      setProjects(JSON.parse(loadedProjects))
    } catch (error) {
      console.error("Error loading projects: ", error)
    }
  }

  const updateProjectPage = async (filePath, updatedPageData) => {
    try {
      console.log("DEBUG - Updating Project Data for: ", filePath, updatedPageData);
      const active = projects.find((project) => project.projectName === activeProject);
      const updatedProjectData = {...active, pages: { ...active.pages, [updatedPageData.activePage]: updatedPageData.activePageData }};
      const str = JSON.stringify(updatedProjectData);
      const updated = await invoke("update_project", { projectPath: filePath, updatedProjectData: str });
      
      const parsed = JSON.parse(updated);
      const newProjects = projects.map((project) => {
        if (project.projectName === parsed.projectName) {
          return parsed;
        }

        return project;
      });

      setProjects(newProjects)
    } catch (error) {
      console.error("Error updating project file: ", error)
    }
  }

  useEffect(() => {
    console.log("DEBUG - Project State: ", projects);
  }, [projects]);

  return (
    <ProjectContext.Provider value={{ createProject, projects, selectProject, loadProjects, updateProjectFile: updateProjectPage }}>
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
