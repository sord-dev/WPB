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
    templateControls: { addComponent, updateComponent, addContainer}
  } = usePageContext();
  const activePageData = pages[activePage].content;

  const [availableComponents, setAvailableComponents] = React.useState([]);
  const [selectedComponent, setSelectedComponent] = React.useState(null);
  const getAllComponents = components => setAvailableComponents(components); // This is a callback function that will be passed to the BuilderEditor component

  // *** this could be a hook or a context
  const [history, setHistory] = React.useState({ [activePage]: [activePageData] });
  const historySnapshot = () => {
    console.log(`DEBUG - History snapshot:`);
    console.log(history);

    if (!history[activePage]) return;

    if (history[activePage].length > 10) { // We only want to keep the last 10 snapshots, for memory optimization
      const newHistory = { ...history, [activePage]: history[activePage].slice(1) };
      setHistory(newHistory);
    } else {

      setHistory({ ...history, [activePage]: [...history[activePage], activePageData] });
    }

  }
  // *** end of potential hook or context

  const appendComponent = (component) => {
    const obj = {
      type: component.name,
      props: convertParamsToObject(component.parameters)
    };

    if(obj.type.toLowerCase() === "container") {
      console.log(`DEBUG - Adding container`);
      addContainer(obj);
      historySnapshot();
      return;
    }
    
    addComponent(obj, selectedComponent);
    setSelectedComponent(obj);
    historySnapshot();
  }

  const updateAndSelectComponent = (component, updatedProps) => { // We use this function in order to see the changes in the editor
    const updated = updateComponent(component, updatedProps);
    // historySnapshot(); // slightly broken, due to the fact we're updating inputs onChange rather than onSubmit in a form (max history is 10 snapshots)
    setSelectedComponent(updated);
  }

  useEffect(() => {
    if (!selectedComponent) return;
    console.log(`DEBUG - Selected component:`);
    console.log(selectedComponent);
  }, [selectedComponent])

  return (
    <section>
      <BuilderTabs {...{ tabs: pageIndex, activeTab: activePage, handleTabClick: setActivePage, createTab: createPage }} />
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
              <BuilderEditor template={activePageData} {...{ getAllComponents, setSelectedComponent }} />
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
  <div style={{ display: "flex", gap: "4px", alignItems: "center", justifyContent: "space-between", fontSize: ".8em" }}>
    <h3>{type}</h3>
    <p style={{ fontSize: ".9em", opacity: ".7" }}><code>{id}</code></p>
  </div>
);