import React from 'react'
import styles from './index.module.css'
import { Outlet } from 'react-router-dom'

export default function SideNavbar() {
  return (
    <>
      <aside className={styles['navigation']}>

      </aside>
      <Outlet />
    </>
  )
}