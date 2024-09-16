import styles from '../index.module.css'

const Text = ({ content, style }) => (
  <p className={styles['component']} style={{ ...style }}>{content || 'No content'}</p>
);
export default Text;