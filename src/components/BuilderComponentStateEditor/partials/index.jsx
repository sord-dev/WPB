import { marginSizes, paddingSizes } from '../config/container';
import styles from '../index.module.css'
import { useEffect, useState } from 'react';

export function TextStylingEditor({ handleAlignmentChange, textAlignmentOptions = [], fontSizeOptions = [], defaultColor = "#C0C0C0" }) {
  const [color, setColor] = useState(defaultColor);

  useEffect(() => {
    setColor(defaultColor);
  }, [defaultColor]);

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

export const ContainerStylingEditor = ({ handleAlignmentChange, containerStyles }) => {
  const [containerStyle, setContainerStyle] = useState(containerStyles);

  useEffect(() => {
    setContainerStyle(containerStyles);
    console.log('containerStyles', containerStyles);
  }, [containerStyles]);

  const handleStyleChange = (style, value) => {
    const newStyle = { ...containerStyle, [style]: value };
    console.log(newStyle);
    setContainerStyle(newStyle);
    handleAlignmentChange(style, value);
  }

  return (
    <div className={styles['styling-editor']}>
      <div className={styles['styling-field']}>
        <span>Padding</span>
        <div className={styles['styling-inputs']}>
          {paddingSizes.map((size, index) => {
            const active = containerStyle?.padding === size.value;

            return containerStyle?.padding == undefined && size.value == 0 ?
              <StylingButton active={true} key={index} label={size.label} value={size.value} option="padding" onChange={handleStyleChange} /> :
              <StylingButton active={active} key={index} label={size.label} value={size.value} option="padding" onChange={handleStyleChange} />
          })}
        </div>
      </div>

      <div className={styles['styling-field']}>
        <span>Margin</span>
        <div className={styles['styling-inputs']}>
          {marginSizes.map((size, index) => {
            const active = containerStyle?.margin === size.value;

            return containerStyle?.margin == undefined && size.value == 0 ?
              <StylingButton active={true} key={index} label={size.label} value={size.value} option="margin" onChange={handleStyleChange} /> :
              <StylingButton active={active} key={index} label={size.label} value={size.value} option="margin" onChange={handleStyleChange} />
          })}
        </div>
      </div>
    </div>
  )
}

export const PropertyEditor = ({ componentProps = null, handlePropChange }) => {
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

const TextState = ({ propName, propValue, onChange }) => {
  const [value, setValue] = useState(propValue);

  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  return (
    <div className={styles["text-state"]}>
      <span>{propName}</span>
      <input type="text" value={value} onChange={(e) => onChange(propName, e.target.value)} />
    </div>
  )
};

const StylingButton = ({ label, value, option, onChange, active = false }) => {
  const highlightStyles = { backgroundColor: "#f0f0f0", color: "#333", border: "1px solid #ccc" };

  return (
    <button style={active ? highlightStyles : {}} onClick={() => onChange(option, value)}>{label}</button>
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
