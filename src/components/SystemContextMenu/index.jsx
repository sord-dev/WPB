import React from 'react'
import styles from './index.module.css'

// these will be overwritten by the functions prop, the actions will be executed within the context custom menu button.
const defaultFunctions = [
  {
    name: "Dashboard",
    action: () => console.log("Navigate to Dashboard"),
  },
  {
    name: "New Website",
    action: () => console.log("New"),
  },
  {
    name: "Open Website",
    action: () => console.log("Open"),
  }
]

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

  return (
    <div className={styles["context-menu-wrapper"]}>
      <div onClick={handleContextMenu} className={styles["context-menu-icon"]}>
        <img src="/grid-dots.svg" alt="System Context Menu Icon" />
      </div>

      {showContextMenu && <ContextMenu {...{ functions, handleClickCallback }} />}
    </div>
  )
}

const ContextMenu = ({ functions, handleClickCallback }) => {
  return (
    <div className={styles["context-menu"]}>
      {functions.map(({ name, action }) => (
        <div key={name} onClick={() => handleClickCallback(action)} className={styles["context-menu-item"]}>
          {name}
        </div>
      ))}
    </div>
  )
}

export default SystemContextMenu