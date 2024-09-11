import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import useShortcut from "../../hooks/useShortcut";

function CreateProjectModal({ createProject, openClose, addTab }) {
  const [projectName, setProjectName] = useState("");
  const [pageName, setPageName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useShortcut([
    { keyCombo: { key: "Enter" }, action: () => handleCreateProject() },
  ]);

  const handleProjectNameChange = (event) => {
    setProjectName(event.target.value);
  };

  const handlePageNameChange = (event) => {
    setPageName(event.target.value);
  };

  const openProject = () => {
    addTab(pageName);
    openClose(false);
  };

  const handleCreateProject = async () => {
    if (projectName.trim() && pageName.trim()) {
      if (projectName.includes(' ') || projectName.match(/[\\/:*?\"<>|]/gi)) {
        setErrorMessage("Project name cannot contain spaces or special characters"); 
        return;
      }

      const tabCreated = await createProject(projectName, pageName);

      if (!tabCreated) {
        setErrorMessage("Project already exists");
        setTimeout(() => {
          setErrorMessage("");
        }, 4000);
      } else {
        openProject();
      }
    } else {
      setErrorMessage("Both project name and page name are required");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }
  };

  return (
    <>
      <div className={styles["create-project"]}>
        <h1>New Project</h1>
        <div className={styles['input-fields']}>
          <div className={styles["input-field"]}>
            <span>Project Name</span>
            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={handleProjectNameChange}
              autoFocus
            />
          </div>
          <div className={styles["input-field"]}>
            <span>Page Name</span>
            <input
              type="text"
              placeholder="Page Name"
              value={pageName}
              onChange={handlePageNameChange}
            />
          </div>
        </div>
        {errorMessage && (
          <div className={styles["error-message"]}>
            <p>{errorMessage}</p>
          </div>
        )}
        <button className={styles["submit"]} onClick={handleCreateProject}>
          Create Project
        </button>
      </div>
    </>
  );
}

export default CreateProjectModal;
