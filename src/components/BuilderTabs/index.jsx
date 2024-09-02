import React, { useState } from "react";
import styles from "./index.module.css";
import Overlay from "../Overlay";
import CreatePageModal from "../CreatePageModal";

function BuilderTabs({
  tabs = [],
  activeTab = null,
  handleTabClick = () => {},
  createTab = () => {},
}) {
  if (!tabs.length) return null;

  const [openClose, setOpenClose] = useState(false);

  return (
    <>
      <ul className={styles["tabs"]}>
        {tabs.map((tab) => (
          <li key={tab}>
            <button
              className={activeTab === tab ? styles["selected"] : ""}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          </li>
        ))}

        <li className={styles["add-btn"]}>
          <button onClick={() => setOpenClose(true)}>+</button>
        </li>
      </ul>
      {openClose && (
        <Overlay openClose={setOpenClose}>
          <CreatePageModal createTab={createTab} openClose={setOpenClose} />
        </Overlay>
      )}
    </>
  );
}

export default BuilderTabs;
