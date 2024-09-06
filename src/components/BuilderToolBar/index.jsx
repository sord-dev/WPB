import React, { useEffect } from 'react'
import styles from './index.module.css'
import { FaDesktop, FaMobileAlt, FaRedo, FaTabletAlt, FaUndo } from 'react-icons/fa'
import { usePageContext } from '../../contexts';

function BuilderToolBar({ screensize = { scale: 100, width: 1440 }, projectTitle, tabName }) {

    return (
        <div className={styles["toolbar"]}>
            <div className={styles['toolbar-field']}>
                <div className={styles["screen-size"]}>
                    <label htmlFor="width">Width:</label>
                    <span id="width">{screensize.width}px</span>
                </div>
                <div className={styles["scale"]}>
                    <label htmlFor="scale">Scale:</label>
                    <span id="scale">{screensize.scale}%</span>
                </div>
                <div className={styles["device-preview"]}>
                    <button>{<FaDesktop />}</button>
                    <button>{<FaTabletAlt />}</button>
                    <button>{<FaMobileAlt />}</button>
                </div>
            </div>

            <div className={styles['toolbar-field']}>
                <div className={styles['title']}>
                    <span>{projectTitle} / {tabName}</span>
                </div>
            </div>

            <div className={styles['toolbar-field']}>
                <div className={styles["actions"]}>
                    <button>{<FaUndo />}</button>
                    <button>{<FaRedo />}</button>
                </div>
            </div>

        </div>
    )
}

export default BuilderToolBar