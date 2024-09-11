import { useNavigate } from 'react-router-dom'
import { generateComponentID } from '../../../utils'
import styles from '../index.module.css'

export const ContextMenu = ({ functions, handleClickCallback, handleMouseLeave }) => {
    const navigate = useNavigate()
    
    return (
        <div className={styles["context-menu"]} onMouseLeave={handleMouseLeave}>
            {functions.map(({ name, action, type }, i) => {
                if (type == "action") return (
                    <div key={generateComponentID(name)} onClick={() => handleClickCallback(action)} className={styles["context-menu-item"]}>
                        {name}
                    </div>
                )

                if (type == "link") return (
                    <div key={generateComponentID(name)} onClick={() => navigate(action())} className={styles["context-menu-item"]}>
                        {name}
                    </div>
                )
            })}
        </div>
    )
}