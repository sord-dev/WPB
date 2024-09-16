import React, { useState } from 'react';
import styles from '../index.module.css'
import { getEffectivePaddingValue } from '../../../utils';
import StylingButton from './StyleButton';
import StylingInput from './StylingInput';

const PaddingField = ({ paddingSizes, activePadding, onChange }) => {
  const [customPadding, setCustomPadding] = useState(false);

  const handlePaddingChange = (side, value) => {
    onChange(side, value);
  };

  return (
    <div className={styles['styling-field']}>
        <span>Padding</span>
        <div className={styles['styling-inputs']}>
          {paddingSizes.map((size, index) => {
            const active = activePadding.padding === size.value;

            return (
              <StylingButton
                active={active}
                key={index}
                label={size.label}
                value={size.value}
                option="padding"
                onChange={() => handlePaddingChange("padding", size.value)}
              />
            );
          })}
        </div>

        <button className={styles['padding-more-btn']} onClick={() => setCustomPadding(prev => !prev)}>More options</button>
        {customPadding && (<CustomPaddingEditor componentPadding={activePadding} getEffectivePaddingValue={getEffectivePaddingValue} handleStyleChange={handlePaddingChange} />)}
      </div>
  );
};

export default PaddingField;

const CustomPaddingEditor = ({ componentPadding, getEffectivePaddingValue, handleStyleChange }) => {
  return (
    <div className={`${styles['styling-inputs']} ${styles["column"]}`}>
      <span>Top</span>
      {console.log(getEffectivePaddingValue(componentPadding, "paddingTop"))}
      <StylingInput
        type="number"
        value={getEffectivePaddingValue(componentPadding, 'paddingTop')}
        onChange={(value) => handleStyleChange('paddingTop', `${value}px`)}
      />
      <span>Bottom</span>
      <StylingInput
        type="number"
        value={getEffectivePaddingValue(componentPadding, 'paddingBottom')}
        onChange={(value) => handleStyleChange('paddingBottom', `${value}px`)}
      />
      <span>Left</span>
      <StylingInput
        type="number"
        value={getEffectivePaddingValue(componentPadding, 'paddingLeft')}
        onChange={(value) => handleStyleChange('paddingLeft', `${value}px`)}
      />
      <span>Right</span>
      <StylingInput
        type="number"
        value={getEffectivePaddingValue(componentPadding, 'paddingRight')}
        onChange={(value) => handleStyleChange('paddingRight', `${value}px`)}
      />
    </div>

  )
};