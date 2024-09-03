import React, { useState } from "react";
import styles from "./index.module.css";

function CreatePageModal({ tabs, pages, createTab, openClose, addTab }) {
  const [tabName, setTabName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (event) => {
    setTabName(event.target.value);
  };

  const openPage = (pageName) => {
    addTab(pageName)
    openClose(false);
  }

  const handleCreateTab = () => {
    if (tabName.trim()) {
      const tabCreated = createTab(tabName);
  
      if (!tabCreated) {
        setErrorMessage("Page already exists");
  
        setTimeout(() => {
          setErrorMessage("");
        }, 4000);
      } else {
        openPage(tabName)
      }
    } else {
      setErrorMessage("Page name is required");
  
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
    }
  };

  

  const availablePages = pages.filter((page) => !tabs.includes(page));

  return (
    <>
      <div className={styles["create-page"]}>
        <h1>New Page</h1>
        <div className={styles["input-field"]}>
          <span>Title</span>
          <input
            type="text"
            placeholder="New page"
            value={tabName}
            onChange={handleInputChange}
          />
        </div>
        {errorMessage && (
          <div className={styles["error-message"]}>
            <p>{errorMessage}</p>
          </div>
        )}
        <button className={styles['submit']} onClick={handleCreateTab}>Create page</button>
      </div>
      {availablePages.length > 0 && (
        <div className={styles["existing-files"]}>
          <span>Existing files</span>
          <ul>
            {availablePages.map((p, i) => (
              <li onClick={() => openPage(p)} key={i}>
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default CreatePageModal;
