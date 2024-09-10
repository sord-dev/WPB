import React, { useState, useContext, createContext, useEffect } from "react";
import { convertObjectKeysToCamelCase, convertObjectKeysToSnakeCase, generateComponentID } from "../../utils";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "../PageContext";
import { useTabContext } from "../TabContext";
import { invoke } from "@tauri-apps/api";
import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";

const ProjectContext = createContext({
  createProject: (projectName, pageName) => { },
  selectProject: (projectName) => { },
  updateProjectPage: (filePath, updatedPage) => { },
  retrieveProjects: () => { },
  projects: [],  // will be gained from the users file system
  activeProject: ""
});

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const { setPageData, activePage } = usePageContext()
  const { clearTabs, addTab } = useTabContext()
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState("");

  const createProject = async (projectName, pageName) => {
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


    const projectDir = await invoke("get_projects_directory");
    const filePath = `${projectDir}/${projectName}.json`;
    
    await writeTextFile(filePath, JSON.stringify(convertObjectKeysToSnakeCase(newProject)));
    
    navigate("/builder");

    return true;
  };

  const selectProject = async (filePath) => {
    console.log("DEBUG - Selecting Project: ", filePath);
    try {
      const raw = await invoke("get_project", { projectPath: filePath });
      let project = convertObjectKeysToCamelCase(raw);
      console.log("DEBUG - Selected Project: ", project);
      clearTabs();

      addTab(project.activePage);
      setActiveProject(project.projectName);
      setPageData(project)
      navigate("/builder");
    } catch (error) {
      console.error("Error loading project: ", error)
    }
  };

  const updateProjectPage = async (filePath, updatedPageData, activePage) => {
    if (!activePage) return;

    try {
      const active = projects.find((project) => project.projectName === activeProject);

      let updatedProjectData = {};
      if (active.pages[activePage] === undefined) {
        console.log("Creating new page, ", activePage);
        updatedProjectData = {
          ...active,
          pages: {
            ...active.pages,
            [activePage]: {
              content: updatedPageData.content
            }
          },
          activePage,
          pageIndex: [...active.pageIndex, activePage]
        }
      }
      else {
        updatedProjectData = {
          ...active,
          pages: {
            ...active.pages,
            [activePage]: {
              ...active.pages[activePage],
              content: updatedPageData.content
            }
          },
          activePage,
          pageIndex: active.pageIndex
        };

      }

      const str = JSON.stringify(convertObjectKeysToSnakeCase(updatedProjectData));
      console.log({ message: "DEBUG - Updating Page: ", activePage, prevPage: active, updatedPageData, payload: str });
      const updated = await invoke("update_project", { projectPath: filePath, updatedProjectData: str });

      const parsed = JSON.parse(updated);
      console.log("DEBUG - Updated Project: ", parsed);

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

  const retrieveProjects = async () => {
    try {
      const loadedProjects = await invoke("scan_for_projects");
      const parsed = JSON.parse(loadedProjects);
      const cammeled = parsed.map((project) => convertObjectKeysToCamelCase(project));
      setProjects(cammeled);

      return { projects: cammeled, error: null };
    } catch (error) {
      console.error("Error loading projects: ", error);
      return { projects: [], error: error };
    }
  }

  useEffect(() => {
    console.log("DEBUG - Project State: ", projects);
  }, [projects]);

  return (
    <ProjectContext.Provider value={{ createProject, projects, setProjects, selectProject, updateProjectPage, retrieveProjects }}>
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
