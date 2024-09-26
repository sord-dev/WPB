import styles from './styles/index.module.css'

const Button = ({ content, onClick, style }) => (
  <button onClick={onClick} style={{ ...style }} className={styles['component']}>
    {content || 'Click me'}
  </button>
);
export default Button;
