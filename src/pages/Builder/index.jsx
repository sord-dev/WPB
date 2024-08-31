import React from "react";

import { usePageContext } from "../../contexts/PageContext";
import { BuilderTabs, BuilderToolBar, Text, Container, BuilderEditor } from "../../components";

import styles from "./index.module.css";

export default function Builder() {
  const { pageIndex, activePage, pages, setActivePage } = usePageContext();
  const activePageData = pages[activePage].content;

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
          {activePageData}

          <BuilderEditor template={{
            type: "container",
            children: [
              {
                type: "text",
                props: {
                  text: "Hello, world!"
                }
              }
            ]
          }} />
        </div>

        <div className={styles['components']}></div>

      </div>
    </section>
  );
}
