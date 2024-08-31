import React from 'react'
import styles from './index.module.css'

function Container({ padding = 0, background, children }) {
    return (
        <div ref={ref => connect(drag(ref))} className={styles["container"]} style={{padding: `${padding}px`, background}}>
            {children}
        </div>
    )
}

export default Container;