import React from "react";

import { usePageContext } from "../../contexts/PageContext";
import { BuilderTabs, BuilderToolBar, Text } from "../../components";

import styles from "./index.module.css";
import { Editor, Element, Frame } from "@craftjs/core";

export default function Builder() {
  const { pageIndex, activePage, pages, setActivePage } = usePageContext();
  const activePageData = pages[activePage].content;

  const handleTabClick = (tab) => {
    setActivePage(tab);
  };

  return (
    <Editor resolver={{ Text }}>
      <section>
        <BuilderTabs tabs={pageIndex} activeTab={activePage} handleTabClick={handleTabClick} />
        <BuilderToolBar screensize={{ scale: 100, width: 1440 }} />

        <div className={styles['builder']}>

          <div className={styles['editor']}></div>

          <div className={styles['constructor']}>
            <Frame>
              <div>
                {activePageData}
                <Element is={Text} fontSize={"20px"} text={"Hello Again! 1"} canvas />
                <Element is={Text} fontSize={"20px"} text={"Hello Again! 2"} canvas />
              </div>
            </Frame>
          </div>

          <div className={styles['components']}></div>

        </div>

      </section>
    </Editor>
  );
}
