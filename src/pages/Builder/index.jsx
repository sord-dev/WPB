import React from "react";

import { usePageContext } from "../../contexts/PageContext";
import { BuilderTabs, BuilderToolBar, BuilderEditor } from "../../components";

import styles from "./index.module.css";

export default function Builder() {
  const { pageIndex, activePage, pages, setActivePage } = usePageContext();
  const activePageData = pages[activePage].content; // will contain the template shown in the BuilderEditor

  const handleTabClick = (tab) => {
    setActivePage(tab);
  };

  return (
    <section>
      <BuilderTabs tabs={pageIndex} activeTab={activePage} handleTabClick={handleTabClick} />
      <BuilderToolBar screensize={{ scale: 100, width: 1440 }} />

      <div className={styles['builder']}>

        <div className={styles['editor']}></div>

        <div className={styles['constructor']}>
          <BuilderEditor template={activePageData}
          />
        </div>

        <div className={styles['components']}></div>

      </div>
    </section>
  );
}
