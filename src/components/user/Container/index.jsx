import React from 'react'
import styles from './index.module.css'
import { useNode } from '@craftjs/core';

function Container({ padding = 0, background, children }) {
    const { connectors: { connect, drag } } = useNode();

    return (
        <div ref={ref => connect(drag(ref))} className={styles["container"]} style={{padding: `${padding}px`, background}}>
            {children}
        </div>
    )
}

export default Container;