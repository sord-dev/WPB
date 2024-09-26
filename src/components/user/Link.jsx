import { Link } from 'react-router-dom';
import styles from './styles/index.module.css'

const _Link = ({ href, content, style }) => (
  <a to={href} style={{ width: "max-content", ...style }} className={styles['component']}>
    {content || 'Click here'}
  </a>
);
export default _Link;
