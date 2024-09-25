import React, { useState, useContext, createContext, useEffect } from "react";
import { convertObjectKeysToCamelCase, convertObjectKeysToSnakeCase, generateComponentID } from "../../utils";
import { useNavigate } from "react-router-dom";
import { usePageContext } from "../PageContext";
import { useTabContext } from "../TabContext";
import { invoke } from "@tauri-apps/api";
import { BaseDirectory, removeFile, renameFile, writeTextFile } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/shell";


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
  const { setPageData } = usePageContext()
  const { clearTabs, addTab, tabs } = useTabContext()
  const navigate = useNavigate();
  const [activeProject, setActiveProject] = useState("");

  const createProject = async (projectName, pageName) => {
    if (projectName.includes(' ') || projectName.match(/[\\/:*?\"<>|]/gi)) return false;

    clearTabs();

    const projectDir = await invoke("get_projects_directory");
    const filePath = `${projectDir}\\${projectName}.json`;

    const projectExists = await invoke("get_project", { projectPath: filePath }).catch(e => false);
    if (projectExists) return false;

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
      activePage: pageName,
      filePath: filePath,
      tabs: [pageName]
    };

    setProjects([...projects, newProject]);
    setPageData(newProject)
    setActiveProject(projectName);
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

      project.tabs.map((t) => addTab(t))
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
      if (!active) throw new Error("No active project found");

      let updatedProjectData = {};
      if (!active.pages[activePage]) {
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
          pageIndex: [...active.pageIndex, activePage],
          tabs
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
          pageIndex: active.pageIndex,
          tabs,
        };
      }

      console.log(updatedProjectData)

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

  const openProjectDirectory = async (filePath) => {
    try {
      const projectDir = filePath.substring(0, filePath.lastIndexOf('\\'));
      await open(`file://${projectDir}`);
      console.log(`Opened directory: ${projectDir}`);
    } catch (error) {
      console.error("Error opening project directory:", error);
    }
  };
  
  const deleteProject = async (filePath) => {
    await removeFile(filePath)
    setProjects((prevProjects) => {
      return prevProjects.filter(project => project.filePath !== filePath);
    });
  }

  const renameProject = async (filePath, newProjectName) => {
    try {
      const projectDir = await invoke("get_projects_directory");
      const newFilePath = `${projectDir}\\${newProjectName}.json`;
  
      const projectExists = projects.some((project) => project.filePath === newFilePath);
      if (projectExists) {
        throw new Error("A project with this name already exists.");
      }

      const project = projects.find((project) => project.filePath === filePath);
      if (!project) throw new Error("Project not found");
  
      const updatedProjectData = {
        ...project,
        projectName: newProjectName,
        filePath: newFilePath,
      };
  
      const str = JSON.stringify(convertObjectKeysToSnakeCase(updatedProjectData));
  
      const updated = await invoke("update_project", {
        projectPath: filePath,
        updatedProjectData: str,
      });
  
      const parsed = convertObjectKeysToCamelCase(JSON.parse(updated));

      console.log("Projects: ", projects)
  
      await renameFile(filePath, newFilePath);
  
      const newProjects = projects.map((proj) =>
        proj.filePath === filePath ? parsed : proj
      );
  
      setProjects(newProjects);
      
      return true;
    } catch (error) {
      console.error("Error renaming project:", error);
      return false;
    }
  };
  

  useEffect(() => {
    console.log("DEBUG - Project State: ", projects);
  }, [projects]);

  return (
    <ProjectContext.Provider value={{ createProject, projects, setProjects, selectProject, updateProjectPage, retrieveProjects, deleteProject, renameProject, openProjectDirectory }}>
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
