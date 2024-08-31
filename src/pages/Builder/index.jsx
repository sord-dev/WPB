import React from "react";

import { usePageContext } from "../../contexts/PageContext";
import { BuilderTabs, BuilderToolBar, Text, Container } from "../../components";

import styles from "./index.module.css";
import { Editor, Element, Frame } from "@craftjs/core";

export default function Builder() {
  const { pageIndex, activePage, pages, setActivePage } = usePageContext();
  const activePageData = pages[activePage].content;

  const handleTabClick = (tab) => {
    setActivePage(tab);
  };

  return (
    <Editor resolver={{ Text, Container }}>
      <section>
        <BuilderTabs tabs={pageIndex} activeTab={activePage} handleTabClick={handleTabClick} />
        <BuilderToolBar screensize={{ scale: 100, width: 1440 }} />

        <div className={styles['builder']}>

          <div className={styles['editor']}></div>

          <div className={styles['constructor']}>
            {activePageData}
            
            <Frame>
              <Element is={Container} padding={4} canvas>
                
                <Text fontSize={"20px"} text={"AHH"}/>
                <Text fontSize={"20px"} text={"WEE"}/>
                
              </Element>
            </Frame>
          </div>

          <div className={styles['components']}></div>

        </div>

      </section>
    </Editor>
  );
}
