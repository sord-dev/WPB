import React from 'react'
import styles from './index.module.css'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SystemContextMenu } from '../../components'
import { usePageContext } from '../../contexts';

export default function SideNavbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { exportControls: { setExporting } } = usePageContext();

  const showBuilderMenu = ['/builder', '/handlers'].some(v => v == pathname);
  const showExportProjectModal = () => {
    navigate('/builder')
    setExporting(true);
  }

  return (
    <>
      <aside className={styles['navigation']}>
        <SystemContextMenu />
        <div className={styles["spacer"]} />

        {showBuilderMenu && (
          <div className={styles["builder-menu"]}>
            <img src="/code.svg" alt="Handlers Page" onClick={() => navigate('/handlers')} />

            <img src="/download.svg" alt="Export Project" onClick={() => showExportProjectModal()} />
          </div>
        )}

      </aside>
      <Outlet />
    </>
  )
}

