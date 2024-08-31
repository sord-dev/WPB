import React from 'react'
import styles from './index.module.css'

function BuilderTabs({ tabs = [], activeTab = null, handleTabClick = () => {}, createTab = () => {} }) {
    if(!tabs.length) return null;

    return (
        <ul className={styles["tabs"]}>
            {tabs.map((tab) => (
                <li key={tab}>
                    <button
                        className={activeTab === tab ? styles["selected"] : ""}
                        onClick={() => handleTabClick(tab)}
                    >
                        {tab}
                    </button>
                </li>
            ))}

            <li className={styles["add-btn"]}>
                <button onClick={() => createTab("boo")}>+</button>
            </li>
        </ul>
    )
}

export default BuilderTabs