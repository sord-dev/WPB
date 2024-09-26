import React from "react";

import { BuilderComponentManager, Overlay, SystemNotificationPopUp } from "../../components";

import styles from "./index.module.css";
import { useComponentContext } from "../../contexts/ComponentContext";


export default function ComponentBuilder() {
  const [notification, setNotification] = React.useState({ message: null });
  
  const { getComponents } = useComponentContext();
  const { arr: components, obj: registery } = getComponents();

  const [componentData, setComponentData] = React.useState(null)
  const [componentHasData, setComponentHasData] = React.useState(componentData !== null);

  return (
    <>
      <section>
        <div className={styles['toolbar']}>
          <div>
            <p>Custom Component #1</p>
          </div>
        </div>

        <div className={styles['builder']}>
          <div className={styles['editor']}>
            <div className={styles['editor-header']}>


            </div>

            <div className={styles['editor-content']}>
              Media
            </div>
          </div>

          <div className={styles['constructor-parent']}>

          </div>

          <div className={styles['components']}>
            <BuilderComponentManager components={components} handleComponentClick={() => { }} />
          </div>

          {notification && <SystemNotificationPopUp {...{ ...notification }} />}

        </div>
      </section>
    </>
  );
}