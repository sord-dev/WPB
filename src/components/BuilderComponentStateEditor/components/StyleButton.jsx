import styles from '../index.module.css'

const StylingButton = ({ label, value, onChange, active = false }) => {
  const highlightStyles = { backgroundColor: "#f0f0f0", color: "#333", border: "1px solid #ccc" };

  return (
    <button style={active ? highlightStyles : {}} onClick={() => onChange(value)}>{label}</button>
  )
}

export default StylingButton;