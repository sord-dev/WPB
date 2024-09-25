import styles from '../index.module.css'
import { useEffect, useState } from "react";

import { disallowedProps } from '../config/prop-editor-disallowed-props';

const PropertyEditor = ({ componentProps = null, handlePropChange }) => {
  if (!componentProps) return null;
  const entries = Object.entries(componentProps);

  return (
    <>
      {entries.map(([propName, propValue], index) => {
        if (disallowedProps.some(val => val == propName)) return null;
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

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(propName, newValue);
  };

  return (
    <div className={styles["text-state"]}>
      <span>{propName}</span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};


export default PropertyEditor