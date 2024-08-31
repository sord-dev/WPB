import React from 'react'
import styles from './index.module.css'

function BuilderTabs({ tabs = [], activeTab = null, handleTabClick = () => {} }) {
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
        </ul>
    )
}

export default BuilderTabs