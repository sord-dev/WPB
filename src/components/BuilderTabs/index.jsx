import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import Overlay from "../Overlay";
import CreatePageModal from "../CreatePageModal";
import { IoMdClose } from "react-icons/io";
import { useTabContext } from "../../contexts";

function BuilderTabs({
  pages,
  activeTab = null,
  handleTabClick = () => {},
  createTab = () => {},
}) {
  const { tabs, addTab, removeTab } = useTabContext();

  if (!tabs.length) return null;

  const [openClose, setOpenClose] = useState(false);

  useEffect(() => {
    const handleCreateTabShortcut = (event) => {
      if (event.ctrlKey && event.key == "t") {
        setOpenClose(true);
      }
    };

    const handleQuickSwitchShortcut = (event) => {
      for (let i = 0; i < tabs.length; i++) {
        if (event.ctrlKey && event.key == i + 1) {
          handleTabClick(tabs[i])
        }
      }
    }


    window.addEventListener("keydown", handleQuickSwitchShortcut);
    window.addEventListener("keydown", handleCreateTabShortcut);

    return () => {
      window.removeEventListener("keydown", handleQuickSwitchShortcut);
      window.removeEventListener("keydown", handleCreateTabShortcut);
    };
  }, [tabs]);

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

              {tabs.length > 1 && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab);
                  }}
                  className={styles["close"]}
                  role="button"
                  tabIndex={0}
                  aria-label={`Close ${tab}`}
                >
                  <IoMdClose />
                </span>
              )}
            </button>
          </li>
        ))}

        <li className={styles["add-btn"]}>
          <button onClick={() => setOpenClose(true)}>+</button>
        </li>
      </ul>

      {openClose && (
        <Overlay openClose={setOpenClose}>
          <CreatePageModal
            tabs={tabs}
            createTab={createTab}
            addTab={addTab}
            openClose={setOpenClose}
            pages={pages}
          />
        </Overlay>
      )}
    </>
  );
}

export default BuilderTabs;
