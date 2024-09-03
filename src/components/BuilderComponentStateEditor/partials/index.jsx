import styles from '../index.module.css'
import { useEffect, useState } from 'react';

const TextState = ({ propName, propValue, onChange }) => {
  return (
    <div className={styles["text-state"]}>
      <span>{propName}</span>
      <input type="text" defaultValue={propValue} onChange={(e) => onChange(propName, e.target.value)} />
    </div>
  )
};

export const ElementPropsEditor = ({ componentProps = null, handlePropChange }) => {
  if (!componentProps) return null;
  const entries = Object.entries(componentProps);

  return (
    <>
      {entries.map(([propName, propValue], index) => {
        if (propName === "style") return null;
        if (propName === "children") return null;
        if (propName === "id") return null;
        return <TextState key={index} propName={propName} propValue={propValue} onChange={handlePropChange} />
      })}
    </>
  )
}

const StylingButton = ({ label, value, option, onChange }) => {
  return (
    <button onClick={() => onChange(option, value)}>{label}</button>
  )
}

const StylingInput = ({ value, type, onChange, className, readOnly = false }) => {
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

export function TextStylingEditor({ handleAlignmentChange, textAlignmentOptions = [], fontSizeOptions = [] }) {
  const [color, setColor] = useState("#C0C0C0");

  const handleColorChange = (newColor) => {
    setColor(newColor);
    handleAlignmentChange("color", newColor);
  };

  return (
    <div className={styles['styling-editor']}>
      <div className={styles['styling-field']}>
        <span>Align</span>
        <div className={styles['styling-inputs']}>
          {textAlignmentOptions.map((option, index) => <StylingButton key={index} {...option} onChange={handleAlignmentChange} />)}
        </div>
      </div>
      <div className={styles['styling-field']}>
        <span>Font Size</span>
        <div className={styles['styling-inputs']}>
          {fontSizeOptions.map((option, index) => <StylingButton key={index} {...option} onChange={handleAlignmentChange} />)}
        </div>
      </div>
      <div className={styles['styling-field']}>
        <span>Color</span>
        <div className={styles['styling-inputs']}>
          <StylingInput
            type="text"
            value={color}
            onChange={handleColorChange}
            className={'color-input'}
            readOnly
          />
          <StylingInput
            type="color"
            value={color}
            onChange={handleColorChange}
            className={'color-picker'}
          />
        </div>
      </div>
    </div>
  )
}
