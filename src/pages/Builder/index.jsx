import React, { useState } from "react";
import styles from "./index.module.css";

export default function Builder() {

  const [selectedTab, setSelectedTab] = useState("Home");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <section>
      <ul className={styles["tabs"]}>
        {["Home", "Services"].map((tab) => (
          <li key={tab}>
            <button
              className={selectedTab === tab ? styles["selected"] : ""}
              onClick={() => handleTabClick(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
      <div className={styles["toolbar"]}>
        <div className={styles["screen-size"]}>
          <label for="width">Width:</label>
          <span id="width">1440px</span>
        </div>
        <div className={styles["scale"]}>
          <label for="scale">Scale:</label>
          <span id="scale">100%</span>
        </div>
        <div className={styles["device-preview"]}>
          <button>🖥️</button>
          <button>💻</button>
          <button>📱</button>
        </div>
        <div className={styles["actions"]}>
          <button>↩️</button>
          <button>↪️</button>
        </div>
      </div>
    </section>
  );
}
