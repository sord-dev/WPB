import React from 'react'
import styles from './index.module.css'
import { Outlet } from 'react-router-dom'

export default function Wrapper({ children }) {

  return (
    <main role="main" id={styles['wrapper']}>
      {children}
      <Outlet />
    </main>
  )
}