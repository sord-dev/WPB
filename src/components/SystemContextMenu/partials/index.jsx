import { generateComponentID } from '../../../utils'
import styles from '../index.module.css'

export const ContextMenu = ({ functions, handleClickCallback }) => {
    return (
        <div className={styles["context-menu"]}>
            {functions.map(({ name, action }, i) => (
                <div key={generateComponentID(name)} onClick={() => handleClickCallback(action)} className={styles["context-menu-item"]}>
                    {name}
                </div>
            ))}
        </div>
    )
}