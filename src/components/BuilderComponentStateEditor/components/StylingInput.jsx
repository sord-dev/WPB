import styles from '../index.module.css'

const StylingInput = ({ value = "", type, onChange, className, readOnly = false }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles[{ className }]}
      readOnly={readOnly}
    />
  )
}

export default StylingInput