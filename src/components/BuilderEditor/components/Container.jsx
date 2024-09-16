import styles from '../index.module.css'

const Container = ({ children, style }) => (
  <section style={{ minHeight: "400px", height: "400px", display: "block", width: "100%", ...style }} className={styles['container']}>
    {children}
  </section>
);
export default Container;