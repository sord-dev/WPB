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
    setSelectedComponent(component);
  }

  const updateAndSelectComponent = (component, updatedProps) => {
    const updated = updateComponent(component, updatedProps);
    console.log(`DEBUG - Updated component:`, updated);
    setSelectedComponent(updated);
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
            {selectedComponent && <ComponentID id={selectedComponent.props.id} type={selectedComponent.type} />}
          </div>

          <div className={styles['editor-content']}>
            {selectedComponent && <BuilderComponentStateEditor {...{ selectedComponent, updateComponent: updateAndSelectComponent }} />}
          </div>
        </div>

        <div className={styles['constructor-parent']}>

          {/* This should be where we export from */}
          <div className={styles['constructor']}>
            <GridContainer columns={12}>
              <BuilderEditor template={activePageData} getAllComponents={getAllComponents} setSelectedComponent={selectComponent} />
            </GridContainer>
          </div>
        </div>

        <div className={styles['components']}>
          <BuilderComponentManager components={availableComponents} handleComponentClick={appendComponent} />
        </div>

      </div>
    </section>
  );
}

const ComponentID = ({ id, type }) => (
  <div style={{ display: "flex", gap: "4px", alignItems: "center", justifyContent: "space-between" ,fontSize: ".8em" }}>
    <h3>{type}</h3>
    <p style={{fontSize: ".9em", opacity: ".7"}}><code>{id}</code></p>
  </div>
);