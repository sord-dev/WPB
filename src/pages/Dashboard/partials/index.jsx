import styles from '../index.module.css'

export const Card = ({ icon, title, subTitle, action }) => {
  return (
    <button onClick={action} className={styles["card"]}>
      <div className={styles["card-icon"]}>{icon}</div>
      <div className={styles["card-content"]}>
        <div className={styles["card-title"]}>{title}</div>
        <div className={styles["card-subtitle"]}>{subTitle}</div>
      </div>
    </button>
  );
};
