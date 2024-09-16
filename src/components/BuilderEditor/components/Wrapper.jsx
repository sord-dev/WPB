import styles from '../index.module.css'

const Wrapper = ({ children }) => (
  <main style={{ minHeight: "600px", height: "100%", display: "block", width: "100%" }} className={styles['wrapper']}>
    {children}
  </main>
);
export default Wrapper;