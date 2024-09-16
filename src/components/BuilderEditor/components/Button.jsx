import styles from '../index.module.css'

const Button = ({ label, onClick, style }) => (
  <button onClick={onClick} style={{ ...style }} className={styles['component']}>
    {label || 'Click me'}
  </button>
);
export default Button;
