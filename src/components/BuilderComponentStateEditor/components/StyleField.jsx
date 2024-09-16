import React from 'react';
import styles from '../index.module.css'
import StylingButton from './StyleButton';

const StyleField = ({ title, options, activeValue, onChange }) => (
  <div className={styles['styling-field']}>
    <span className={styles['title']}>{title}</span>
    <div className={styles['styling-inputs']}>
      {options.map((option, index) => {
        const active = option.value === activeValue;
        return <StylingButton active={active} key={index} value={option.value} onChange={onChange} label={option.label} />
      })}
    </div>
  </div>
);

export default StyleField;
