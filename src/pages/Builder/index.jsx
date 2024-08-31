import React from "react";

import { usePageContext } from "../../contexts/PageContext";
import { BuilderTabs, BuilderToolBar, BuilderEditor } from "../../components";

import styles from "./index.module.css";

export default function Builder() {
  const { pageIndex, activePage, pages, setActivePage, createPage } = usePageContext();
  const activePageData = pages[activePage].content;

  const [availableComponents, setAvailableComponents] = React.useState([]);
  const getAllComponents = components => setAvailableComponents(components);

  const handleTabClick = (tab) => {
    setActivePage(tab);
  };

  return (
    <section>
      <BuilderTabs {...{ tabs: pageIndex, activeTab: activePage, handleTabClick, createTab: createPage }} />
      <BuilderToolBar screensize={{ scale: 100, width: 1440 }} />

      <div className={styles['builder']}>
        <div className={styles['editor']}></div>

        <div className={styles['constructor']}>
          <BuilderEditor template={activePageData} getAllComponents={getAllComponents} />
        </div>

        <div className={styles['components']}>
          {availableComponents?.map((component) => (
            <div key={component.name} className={styles['component']}>
              <span>{component.name}</span>
              <span>{component.parameters.join(", ")}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
