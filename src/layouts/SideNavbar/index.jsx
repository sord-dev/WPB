import React from 'react'
import styles from './index.module.css'
import { Outlet } from 'react-router-dom'
import { SystemContextMenu } from '../../components'

export default function SideNavbar() {
  return (
    <>
      <aside className={styles['navigation']}>
        <SystemContextMenu />
        <div className={styles["spacer"]} />
        
      </aside>
      <Outlet />
    </>
  )
}

