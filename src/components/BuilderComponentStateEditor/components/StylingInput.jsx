import styles from '../index.module.css'

const StylingInput = ({ value = "", type, onChange, className, readOnly = false, disabled }) => {

  return (
    <input
      type={type}
      value={value}
      onChange={e => !disabled && onChange(e.target.value)}
      className={styles[className]}
      readOnly={readOnly}
      disabled={disabled}
    />
  )
}

export default StylingInput