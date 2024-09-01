import React from 'react'
import styles from './index.module.css'
import { FaDesktop, FaMobileAlt, FaRedo, FaTabletAlt, FaUndo } from 'react-icons/fa'

function BuilderToolBar({ screensize = { scale: 100, width: 1440 } }) {

    return (
        <div className={styles["toolbar"]}>
            <div className={styles["screen-size"]}>
                <label for="width">Width:</label>
                <span id="width">{screensize.width}px</span>
            </div>

            <div className={styles["scale"]}>
                <label for="scale">Scale:</label>
                <span id="scale">{screensize.scale}%</span>
            </div>

            <div className={styles["device-preview"]}>
                <button>{<FaDesktop />}</button>
                <button>{<FaTabletAlt />}</button>
                <button>{<FaMobileAlt />}</button>
            </div>

            <div className={styles["actions"]}>
                <button>{<FaUndo />}</button>
                <button>{<FaRedo />}</button>
            </div>

        </div>
    )
}

export default BuilderToolBar