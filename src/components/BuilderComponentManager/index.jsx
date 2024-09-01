import React from 'react'
import { generateComponentID } from '../../utils'

import styles from './index.module.css'

function BuilderComponentManager({ components = [], handleComponentClick }) {
    if(!components) return null;

    return (
        <>
            {components?.map((component) => (
                <div key={generateComponentID(component.name)} onClick={() => handleComponentClick(component)} className={styles['component']}>
                    <span>{component.name}</span>
                    <span>{component.parameters.join(", ")}</span>
                </div>
            ))}
        </>
    )
}

export default BuilderComponentManager