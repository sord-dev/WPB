import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

function CreateProjectModal({ createProject, openClose, addTab }) {
  const [projectName, setProjectName] = useState("");
  const [pageName, setPageName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleCreateProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [projectName, pageName]);

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

  const handleCreateProject = () => {
    if (projectName.trim() && pageName.trim()) {
      const tabCreated = createProject(projectName, pageName);
      
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
