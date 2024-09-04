import styles from '../index.module.css'
import { useEffect, useState } from 'react';

export function TextStylingEditor({ handleAlignmentChange, textAlignmentOptions = [], fontSizeOptions = [], componentStyles = { color: "#C0C0C0" } }) {
  const [color, setColor] = useState(componentStyles.color);

  useEffect(() => {
    setColor(componentStyles.color);
  }, [componentStyles]);

  const handleColorChange = (newColor) => {
    setColor(newColor);
    handleAlignmentChange("color", newColor);
  };

  return (
    <div className={styles['styling-editor']}>
      <div className={styles['styling-field']}>
        <span>Align</span>
        <div className={styles['styling-inputs']}>
          {textAlignmentOptions.map((option, index) => {
            const active = option.value === componentStyles.textAlign;
            return <StylingButton key={index} active={active} {...option} onChange={handleAlignmentChange} />
          })}
        </div>
      </div>
      <div className={styles['styling-field']}>
        <span>Font Size</span>
        <div className={styles['styling-inputs']}>
          {fontSizeOptions.map((option, index) => {
            const active = option.value === componentStyles.fontSize;
            return <StylingButton active={active} key={index} {...option} onChange={handleAlignmentChange} />
          })}
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

export const ContainerStylingEditor = ({ handleAlignmentChange, containerStyles, marginSizes = [], paddingSizes = [] }) => {
  const [containerStyle, setContainerStyle] = useState(containerStyles);

  useEffect(() => {
    // setContainerStyle(containerStyles);
    console.log('containerStyles', containerStyles);
  }, [containerStyles]);

  const handleStyleChange = (style, value) => {
    const newStyle = { ...containerStyle, [style]: value };
    
    if (style === "padding") {
      newStyle.paddingTop = value;
      newStyle.paddingRight = value;
      newStyle.paddingBottom = value;
      newStyle.paddingLeft = value;
    }

    console.log(newStyle)

    setContainerStyle(newStyle);
    handleAlignmentChange(style, value);
  };

  const getEffectivePaddingValue = (side) => {
    return containerStyle[side] !== undefined ? parseInt(containerStyle[side]) : parseInt(containerStyle.padding) || 0;
  };

  return (
    <div className={styles['styling-editor']}>
      <div className={styles['styling-field']}>
        <span>Padding</span>
        <div className={styles['styling-inputs']}>
          {paddingSizes.map((size, index) => {
            const active = containerStyle?.padding === size.value;

            return (
              <StylingButton
                active={active}
                key={index}
                label={size.label}
                value={size.value}
                option="padding"
                onChange={handleStyleChange}
              />
            );
          })}
        </div>
        <div className={`${styles['styling-inputs']} ${styles["column"]}`}>
          <span>Top</span>
          <StylingInput
            type="number"
            value={getEffectivePaddingValue('paddingTop')}
            onChange={(value) => handleStyleChange('paddingTop', `${value}px`)}
          />
          <span>Bottom</span>
          <StylingInput
            type="number"
            value={getEffectivePaddingValue('paddingBottom')}
            onChange={(value) => handleStyleChange('paddingBottom', `${value}px`)}
          />
          <span>Left</span>
          <StylingInput
            type="number"
            value={getEffectivePaddingValue('paddingLeft')}
            onChange={(value) => handleStyleChange('paddingLeft', `${value}px`)}
          />
          <span>Right</span>
          <StylingInput
            type="number"
            value={getEffectivePaddingValue('paddingRight')}
            onChange={(value) => handleStyleChange('paddingRight', `${value}px`)}
          />
        </div>
      </div>

      <div className={styles['styling-field']}>
        <span>Margin</span>
        <div className={styles['styling-inputs']}>
          {marginSizes.map((size, index) => {
            const active = containerStyle?.margin === size.value;

            return (
              <StylingButton
                active={active}
                key={index}
                label={size.label}
                value={size.value}
                option="margin"
                onChange={handleStyleChange}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};


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
