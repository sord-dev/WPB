import { Link } from 'react-router-dom';
import styles from '../index.module.css'

const _Link = ({ href, label, style }) => (
  <Link to={href} style={{ width: "max-content", ...style }} className={styles['component']}>
    {label || 'Click here'}
  </Link>
);
export default _Link;
