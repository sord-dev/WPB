import React from 'react'
import styles from './index.module.css'
import { Outlet } from 'react-router-dom'

export default function Navbar() {
  return (
    <>
      <nav className={styles['navigation']}>

      </nav>
      <Outlet />
    </>
  )
}