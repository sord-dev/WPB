import React, { useEffect, useState } from "react";
import styles from "./index.module.css";
import Overlay from "../Overlay";
import CreatePageModal from "../CreatePageModal";
import { IoMdClose } from "react-icons/io";
import { useTabContext } from "../../contexts";
import useShortcut from "../../hooks/useShortcut";

function BuilderTabs({
  pages,
  activeTab = null,
  handleTabClick = () => {},
  createTab = () => {},
}) {
  const { tabs, addTab, removeTab } = useTabContext();

  if (!tabs.length) return null;

  const [openClose, setOpenClose] = useState(false);

  const tabShortcuts = tabs.map((tab, index) => ({
    keyCombo: { ctrlKey: true, key: `${index + 1}` },
    action: () => handleTabClick(tab),
  }));

  useShortcut([
    ...tabShortcuts,
    { keyCombo: { ctrlKey: true, key: "t" }, action: () => setOpenClose(true) },
    { keyCombo: { ctrlKey: true, key: "w" }, action: () => removeTab(activeTab) }
  ]);

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
