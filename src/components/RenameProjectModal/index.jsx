import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import useShortcut from "../../hooks/useShortcut";

function RenameProjectModal({ renameProject, openClose, filePath }) {
  const [newProjectName, setNewProjectName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useShortcut([
    { keyCombo: { key: "Enter" }, action: () => handleCreateProject() },
  ]);

  const handleNewProjectNameChange = (event) => {
    setNewProjectName(event.target.value);
  };

  const handleRenameProject = async () => {
    if (newProjectName.trim()) {
      if (newProjectName.includes(' ') || newProjectName.match(/[\\/:*?\"<>|]/gi)) {
        setErrorMessage("Project name cannot contain spaces or special characters"); 
        return;
      }

      const renamedProject = await renameProject(filePath, newProjectName);

      console.log(renamedProject)

      if (!renamedProject) {
        setErrorMessage("Project already exists or could not rename project");
        setTimeout(() => {
          setErrorMessage("");
        }, 4000);
      } else {
        openClose(false);
      }
    } else {
      setErrorMessage("Project name is required");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }
  };

  return (
    <>
      <div className={styles["create-project"]}>
        <h1>Rename Project</h1>
        <div className={styles['input-fields']}>
          <div className={styles["input-field"]}>
            <span>New Project Name</span>
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={handleNewProjectNameChange}
              autoFocus
            />
          </div>
        </div>
        {errorMessage && (
          <div className={styles["error-message"]}>
            <p>{errorMessage}</p>
          </div>
        )}
        <button className={styles["submit"]} onClick={handleRenameProject}>
          Rename Project
        </button>
      </div>
    </>
  );
}

export default RenameProjectModal;
