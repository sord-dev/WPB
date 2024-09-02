import React, { useEffect } from "react";

import { usePageContext } from "../../contexts";
import { BuilderTabs, BuilderToolBar, BuilderEditor, BuilderComponentManager, GridContainer, BuilderComponentStateEditor } from "../../components";

import styles from "./index.module.css";
import { convertParamsToObject } from "../../utils";

export default function Builder() {
  const {
    pageIndex,
    activePage,
    pages,
    pageControls: { setActivePage, createPage },
    templateControls: { addComponent, updateComponent }
  } = usePageContext();
  const activePageData = pages[activePage].content;

  const [availableComponents, setAvailableComponents] = React.useState([]);
  const [selectedComponent, setSelectedComponent] = React.useState(null);
  const getAllComponents = components => setAvailableComponents(components); // This is a callback function that will be passed to the BuilderEditor component

  const handleTabClick = (tab) => {
    setActivePage(tab);
  };

  const appendComponent = (component) => {
    const obj = {
      type: component.name,
      props: convertParamsToObject(component.parameters)
    };

    addComponent(obj, selectedComponent);
    setSelectedComponent(obj);
  }

  const selectComponent = (component) => {
    if (component.props.id === selectedComponent.props.id) return;
    setSelectedComponent(component);
  }

  useEffect(() => {
    if (!selectedComponent) return;
    console.log(`DEBUG - Selected component:`);
    console.log(selectedComponent);
  }, [selectedComponent])

  return (
    <section>
      <BuilderTabs {...{ tabs: pageIndex, activeTab: activePage, handleTabClick, createTab: createPage }} />
      <BuilderToolBar screensize={{ scale: 100, width: 1440 }} />

      <div className={styles['builder']}>
        <div className={styles['editor']}>
          <div className={styles['editor-header']}>
            {selectedComponent && <h2>{selectedComponent.type}</h2>}
          </div>
          <div className={styles['editor-content']}>
            {selectedComponent && (
              <>
                <BuilderComponentStateEditor {...{ selectedComponent, updateComponent }}/>

                <div>
                  <button onClick={() => updateComponent(selectedComponent, { style: { color: "red" } })}>Update Style</button>
                  <button onClick={() => updateComponent(selectedComponent, { content: "Hello World" })}>Update Component</button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className={styles['constructor']}>
          <GridContainer columns={12}>
            <BuilderEditor template={activePageData} getAllComponents={getAllComponents} setSelectedComponent={selectComponent} />
          </GridContainer>
        </div>

        <div className={styles['components']}>
          <BuilderComponentManager components={availableComponents} handleComponentClick={appendComponent} />
        </div>

      </div>
    </section>
  );
}
