import styles from '../index.module.css'
import { useEffect, useState } from 'react';


// Text Styling Editor

const defaultComponentStyles = {
  color: "#C0C0C0",
  fontSize: "16px",
  textAlign: "left",
  padding: "0px"
};

// TODO - https://medium.com/@spenceraford/cursed-cursor-fixing-cursor-jump-in-react-inputs-262906d389aa
export function TextStylingEditor({ handleAlignmentChange, textAlignmentOptions = [], fontSizeOptions = [], componentStyles, paddingSizes = [] }) {
  const [color, setColor] = useState(componentStyles.color);
  const [customPadding, setCustomPadding] = useState(false);
  const [styleState, setStyleState] = useState(componentStyles || defaultComponentStyles);

  useEffect(() => {
    setColor(componentStyles.color || defaultComponentStyles.color);
    setStyleState(componentStyles || defaultComponentStyles);
    console.log('componentStyles', componentStyles);
  }, [componentStyles]);

  const handleColorChange = (newColor) => {
    setColor(newColor);
    handleAlignmentChange("color", newColor);
  };

  const handleStyleChange = (style, value) => {
    const updatedStyles = { ...styleState, [style]: value };
    setStyleState(updatedStyles);
    handleAlignmentChange(style, value);
  };

  const getEffectivePaddingValue = (side) => {
    return styleState[side] !== undefined ? parseInt(styleState[side]) : parseInt(styleState.padding) || 0;
  };

  return (
    <div className={styles['styling-editor']}>
      <div className={styles['styling-field']}>
        <span>Align</span>
        <div className={styles['styling-inputs']}>
          {textAlignmentOptions.map((option, index) => {
            const active = option.value === (styleState.textAlign ? styleState.textAlign : defaultComponentStyles.textAlign);
            return <StylingButton key={index} active={active} {...option} onChange={handleAlignmentChange} />;
          })}
        </div>
      </div>
      <div className={styles['styling-field']}>
        <span>Font Size</span>
        <div className={styles['styling-inputs']}>
          {fontSizeOptions.map((option, index) => {
            const active = option.value === (styleState.fontSize ? styleState.fontSize + "px" : defaultComponentStyles.fontSize);
            return <StylingButton active={active} key={index} {...option} onChange={handleAlignmentChange} />;
          })}
        </div>
      </div>
      <div className={styles['styling-field']}>
        <span>Padding</span>
        <div className={styles['styling-inputs']}>
          {paddingSizes.map((size, index) => {
            const active = styleState.padding === size.value;
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
        <button className={styles['padding-more-btn']} onClick={() => setCustomPadding(prev => !prev)}>More options</button>
        {customPadding && (<CustomPaddingEditor getEffectivePaddingValue={getEffectivePaddingValue} handleStyleChange={handleStyleChange} />)}
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
  );
}

// Container Styling Editor

const defaultContainerStyles = {
  margin: "0px",
  padding: "0px",
  backgroundColor: "transparent"
};

export const ContainerStylingEditor = ({ handleAlignmentChange, handleAlignmentChanges, containerStyles, paddingSizes = [] }) => {
  const [containerStyle, setContainerStyle] = useState(containerStyles || defaultContainerStyles);
  const [customPadding, setCustomPadding] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(containerStyles?.backgroundColor || defaultContainerStyles.backgroundColor);

  useEffect(() => {
    const containerStylesState = containerStyles || defaultContainerStyles;
    setContainerStyle(containerStylesState);
    setBackgroundColor(containerStylesState.backgroundColor);
  }, [containerStyles]);

  const handleStyleChange = (style, value) => {
    const safeValue = value || "0px";
    const newStyle = { ...containerStyle, [style]: safeValue };

    if (style === 'padding') {
      const clearedStyles = clearPadding(newStyle);
      setContainerStyle(clearedStyles);
      return handleAlignmentChanges(clearedStyles);
    }

    setContainerStyle(newStyle);
    handleAlignmentChange(style, safeValue);
  };

  const handleBackgroundColorChange = (newColor) => {
    setBackgroundColor(newColor);
    handleStyleChange("backgroundColor", newColor);
  };

  const clearPadding = (obj) => {
    delete obj.paddingTop;
    delete obj.paddingBottom;
    delete obj.paddingLeft;
    delete obj.paddingRight;

    return obj;
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
            const active = containerStyle.padding === size.value;

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

        <button className={styles['padding-more-btn']} onClick={() => setCustomPadding(prev => !prev)}>More options</button>
        {customPadding && (<CustomPaddingEditor getEffectivePaddingValue={getEffectivePaddingValue} handleStyleChange={handleStyleChange} />)}
        <div className={styles['styling-field']}>
          <span>Background Color</span>
          <div className={styles['styling-inputs']}>
            <StylingInput
              type="text"
              value={backgroundColor}
              onChange={handleBackgroundColorChange}
              className={'color-input'}
              readOnly
            />
            <StylingInput
              type="color"
              value={backgroundColor}
              onChange={handleBackgroundColorChange}
              className={'color-picker'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomPaddingEditor = ({ getEffectivePaddingValue, handleStyleChange }) => {
  return (
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

  )
};

// Universal Props Editor

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

// Universal Styling Component Partials

const StylingButton = ({ label, value, option, onChange, active = false }) => {
  const highlightStyles = { backgroundColor: "#f0f0f0", color: "#333", border: "1px solid #ccc" };

  return (
    <button style={active ? highlightStyles : {}} onClick={() => onChange(option, value)}>{label}</button>
  )
}

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
