import React from 'react'
import styles from './index.module.css'
import { ContextMenu } from './partials'

import { defaultFunctions } from './config'

function SystemContextMenu({ functions = defaultFunctions }) {
  const [showContextMenu, setShowContextMenu] = React.useState(false)

  const handleContextMenu = (e) => {
    e.preventDefault()
    setShowContextMenu(prev => !prev)
  }

  const handleClickCallback = (action) => {
    setShowContextMenu(false)
    action()
  }

  const handleMouseLeave = () => {
    setShowContextMenu(false)
  }

  return (
    <div className={styles["context-menu-wrapper"]}>
      <div onClick={handleContextMenu} className={styles["context-menu-icon"]}>
        <img src="/grid-dots.svg" alt="System Context Menu Icon" />
      </div>

      {showContextMenu && <ContextMenu {...{ functions, handleClickCallback, handleMouseLeave }} />}
    </div>
  )
}


export default SystemContextMenu