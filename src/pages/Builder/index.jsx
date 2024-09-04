import React, { useEffect } from "react";

import { usePageContext } from "../../contexts";
import { BuilderTabs, BuilderToolBar, BuilderEditor, BuilderComponentManager, GridContainer, BuilderComponentStateEditor, SystemNotificationPopUp } from "../../components";

import styles from "./index.module.css";
import { convertParamsToObject } from "../../utils";

export default function Builder() {
  const {
    pageIndex,
    activePage,
    pages,
    pageControls: { setActivePage, createPage },
    templateControls: { addComponent, updateComponent, addContainer, deleteComponent }
  } = usePageContext();
  const activePageData = pages[activePage].content;

  const [availableComponents, setAvailableComponents] = React.useState([]);
  const [selectedComponent, setSelectedComponent] = React.useState(null);
  const getAllComponents = components => setAvailableComponents(components); // This is a callback function that will be passed to the BuilderEditor component

  const [error, setError] = React.useState(null);

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
    if(!selectedComponent) return setError({ message: "Please select a container to add the component to" });

    const obj = {
      type: component.name,
      props: convertParamsToObject(component.parameters)
    };

    if (obj.type.toLowerCase() === 'text' && selectedComponent.type.toLowerCase() === "wrapper") { // is this a text component being made at the top level?
      setError({ message: "Text components must be inside a container" });
    }

    if (obj.type.toLowerCase() === "container") { // Is this a container?
      setSelectedComponent(addContainer(obj)); // If so, add it to the active page on the root level
      historySnapshot();
      return;
    }

    if (obj.type.toLowerCase() === "container" && selectedComponent.type.toLowerCase() === "wrapper") { // is this a container being made at the top level?
      setSelectedComponent(addContainer(obj)); // If so, add it to the active page on the root level
      historySnapshot();
      return;
    }

    if (selectedComponent.type.toLowerCase() === "container") { // Is this a component being added to a container?
      // addComponent(obj, selectedComponent) // If so, add it to the active page inside the container (if you uncomment the line below, comment this line)
      setSelectedComponent(addComponent(obj, selectedComponent)); // Uncomment this line if you want to select the element after adding it (potential hotkey) 
      historySnapshot();
      return;
    }
  }

  const removeComponent = (component) => {
    deleteComponent(component);
    setSelectedComponent(activePageData);
    historySnapshot();
  }

  const updateAndSelectComponent = (component, updatedProps) => { // We use this function in order to see the changes in the editor
    const updated = updateComponent(component, updatedProps);
    // historySnapshot(); // slightly broken, due to the fact we're updating inputs onChange rather than onSubmit in a form (max history is 10 snapshots, add debounce?)
    setSelectedComponent(updated);
  }

  const handleTabClick = (templateIndex) => {
    setSelectedComponent(pages[templateIndex].content);
    setActivePage(templateIndex);
  }

  useEffect(() => {
    if (!selectedComponent) return;
    console.log(`DEBUG - Selected component:`);
    console.log(selectedComponent);
  }, [selectedComponent])

  useEffect(() => {
    setSelectedComponent(activePageData);
  }, [])

  return (
    <section>
      <BuilderTabs {...{ pages: pageIndex, activeTab: activePage, handleTabClick, createTab: createPage }} />
      <BuilderToolBar screensize={{ scale: 100, width: 1440 }} />

      <div className={styles['builder']}>
        <div className={styles['editor']}>
          <div className={styles['editor-header']}>
            {selectedComponent && <ComponentID id={selectedComponent.props.id} type={selectedComponent.type} />}
          </div>

          <div className={styles['editor-content']}>
            {selectedComponent && <BuilderComponentStateEditor {...{ selectedComponent, updateComponent: updateAndSelectComponent, deleteComponent: removeComponent }} />}
          </div>
        </div>

        <div className={styles['constructor-parent']}>

          {/* This should be where we export from */}
          <div className={styles['constructor']}>
            <GridContainer columns={12}>
              <BuilderEditor template={activePageData} {...{ getAllComponents, setSelectedComponent, selectedComponent }} />
            </GridContainer>
          </div>
        </div>

        <div className={styles['components']}>
          <BuilderComponentManager components={availableComponents} handleComponentClick={appendComponent} />
        </div>

        {error && <SystemNotificationPopUp {...{ ...error, timeout: 1500, onClose: () => setError(null) }} />}

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