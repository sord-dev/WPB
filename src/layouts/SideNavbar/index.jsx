import React from 'react'
import styles from './index.module.css'
import { Outlet, useLocation } from 'react-router-dom'
import { SystemContextMenu } from '../../components'
import { usePageContext } from '../../contexts';

export default function SideNavbar() {
  const { pathname } = useLocation();
  const {exportControls: { setExporting }} = usePageContext();

  return (
    <>
      <aside className={styles['navigation']}>
        <SystemContextMenu />
        <div className={styles["spacer"]} />

        {pathname === '/builder' && (
            <div className={styles["builder-menu"]}>
               <img src="/download.svg" alt="Export Page" onClick={() => setExporting(true)}/>
            </div>
        )}

      </aside>
      <Outlet />
    </>
  )
}

