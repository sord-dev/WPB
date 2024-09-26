import React, { useEffect } from "react";

import { usePageContext, useProjectContext, useTabContext } from "../../contexts";

import {
  BuilderTabs,
  BuilderToolBar,
  BuilderEditor,
  BuilderComponentManager,
  GridContainer,
  BuilderComponentStateEditor,
  SystemNotificationPopUp,
  ExportPageModal,
  Overlay
} from "../../components";

import styles from "./index.module.css";
import { convertParamsToObject } from "../../utils";
import { useExportContext } from "../../contexts/ExportContext";
import { disallowedPropsFunctionality } from "../../components/BuilderComponentStateEditor/config/prop-editor-disallowed-props";

export default function Builder() {
  const {
    projectName,
    pageIndex,
    activePage,
    pages,
    filePath,
    pageControls: { setActivePage, createPage },
    templateControls: { addComponent, updateComponent, addContainer, deleteComponent },
    exportControls: { exportProject, setExporting },
    exporting,
    getPageData
  } = usePageContext();

  const { tabs } = useTabContext()
  const { updateProjectPage } = useProjectContext();
  const activePageData = pages[activePage]?.content;

  const { display } = useExportContext()

  const [availableComponents, setAvailableComponents] = React.useState([]);
  const [selectedComponent, setSelectedComponent] = React.useState(null);
  const getAllComponents = components => setAvailableComponents(components);
  const hasFunctionalityProps = Object.keys(selectedComponent?.props || {}).some(prop => !disallowedPropsFunctionality.includes(prop)) || false;

  const [notification, setNotification] = React.useState(null);
  const [propertyStylingState, setPropertyStylingState] = React.useState({ editing: "styling" });
  const changePropertyStylingState = (state) => setPropertyStylingState({ editing: state });

  const [history, setHistory] = React.useState({ [activePage]: [activePageData] }); // TODO - Fix this:
  const historySnapshot = () => {
    const pageHistory = history[activePage]; // TODO - Fix this: 
    // page history is an array of snapshots
    // currently, our activePage updates on every tab click, so we're only storing history for the active page
    // but the first conditional isnt' working as expected, so this is unused at the moment

    if (!pageHistory) { // If there's no history for the active page, add an initial snapshot
      setHistory({ ...history, [activePage]: [activePageData] });
    } else if (pageHistory?.length > 10) { // We only want to keep the last 10 snapshots, for memory optimization
      const newHistory = { ...history, [activePage]: pageHistory.slice(1) };
      setHistory(newHistory);
    } else { // If we have less than 10 snapshots, add a new one
      setHistory({ ...history, [activePage]: [...history[activePage], activePageData] });
    }

    console.log(`DEBUG - History snapshot:`);
    console.log(history);
  }

  const appendComponent = (component) => {
    if (!selectedComponent) return setNotification({ message: "Please select a container to add the component to" });

    const obj = {
      type: component.name,
      props: convertParamsToObject(component.parameters)
    };

    if (obj.type.toLowerCase() !== 'container' && selectedComponent.type.toLowerCase() === "wrapper") { // is this a text component being made at the top level?
      setNotification({ message: "All components must be inside a container" });
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
    setSelectedComponent(pages[templateIndex]?.content);
    setActivePage(templateIndex);
  };

  useEffect(() => {
    if (getPageData().activePage !== null) {
      const updatedPageData = getPageData();
      setSelectedComponent(updatedPageData.pages[getPageData().activePage]?.content);
    }
  }, [getPageData().activePage]);

  const handleCreatePage = (name) => {
    const success = createPage(name);

    console.log(success)

    if (success) {
      return true
    } else {
      setNotification({ message: "Page creation error: Page already exists" });
    }
  }

  useEffect(() => {
    if (!selectedComponent) return;
    setPropertyStylingState({ editing: "styling" });
  }, [selectedComponent])

  useEffect(() => {
    setSelectedComponent(activePageData);
  }, [])

  // debounce function to commit changes to file system

  useEffect(() => {
    let previousPage = null;
    const debounce = setTimeout(() => {
      if (activePage === null) return;

      if (previousPage !== JSON.stringify(activePageData) && filePath) { // if the active page has changed, and there is a file path save to file system
        previousPage = JSON.stringify(pages[activePage]);
        // save pageData to file system
        console.log("DEBUG - Saving page data to file system:", pages[activePage]);
        updateProjectPage(filePath, pages[activePage], activePage);

        // TODO - Add a lastUpdated timestamp to the project
        //const timestamp = new Date().toLocaleTimeString();
        // setNotification({ message: `File Saved @ ${timestamp}`, timeout: 600 }); - this works btw
      }

    }, 500);

    return () => clearTimeout(debounce);
  }, [activePageData, activePage, filePath, pages, tabs]);


  return (
    <>
      <section>
        <BuilderTabs {...{ pages: pageIndex, activeTab: activePage, handleTabClick, createTab: handleCreatePage }} />
        <BuilderToolBar screensize={{ scale: 100, width: 1440 }} projectTitle={projectName} tabName={activePage} />

        <div className={styles['builder']}>
          <div className={styles['editor']}>

            <div className={styles['editor-header']}>
              {selectedComponent && <BuilderComponentPropsEditorTabs
                activeTab={propertyStylingState.editing}
                componentType={selectedComponent.type}
                handleTabClick={changePropertyStylingState}
                hasFunctionalityProps={hasFunctionalityProps}
              />}
              {selectedComponent && <ComponentID id={selectedComponent.props.id} type={selectedComponent.type} />}
            </div>

            <div className={styles['editor-content']}>
              {selectedComponent && <BuilderComponentStateEditor {...{
                selectedComponent,
                updateComponent: updateAndSelectComponent,
                deleteComponent: removeComponent,
                ...propertyStylingState
              }} />}
            </div>
          </div>

          <div className={styles['constructor-parent']}>
            <GridContainer columns={12}>
              <BuilderEditor template={activePageData} {...{ getAllComponents, setSelectedComponent, selectedComponent }} />
            </GridContainer>
          </div>

          <div className={styles['components']}>
            <BuilderComponentManager components={availableComponents} handleComponentClick={appendComponent} />
          </div>

          {notification && <SystemNotificationPopUp {...{ ...notification, onClose: () => setNotification(null) }} />}

        </div>
      </section>

      {exporting && (
        <Overlay openClose={(val) => setExporting(val)}>
          <ExportPageModal  {...{ exportProject, tabs, display: (html, type) => { setExporting(false); display(html, type) } }} />
        </Overlay>
      )}

    </>
  );
}

const BuilderComponentPropsEditorTabs = ({ activeTab = "styling", handleTabClick, componentType, hasFunctionalityProps }) => {
  if (componentType === "wrapper") return null;
  const functionalityClasses = hasFunctionalityProps ? activeTab == "functionality" && styles['active'] : styles['disabled'];
  return (
    <div className={styles['editor-tabs']}>
      <div className={activeTab == "styling" && styles['active']} onClick={() => handleTabClick("styling")}>
        <p>Styling</p>
      </div>

      <div className={functionalityClasses} onClick={() => handleTabClick("functionality")}>
        <p>Functionality</p>
      </div>
    </div>
  )
}

const ComponentID = ({ id, type }) => {
  if (!id) return null;
  if (type === "wrapper") return null;
  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center", justifyContent: "space-between", fontSize: ".8em", padding: "0 12px" }}>
      <h3>{type}</h3>
      <p style={{ fontSize: ".9em", opacity: ".7" }}><code>{id}</code></p>
    </div>
  );
}