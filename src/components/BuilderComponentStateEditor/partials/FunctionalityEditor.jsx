import styles from '../index.module.css'
import { useEffect, useState } from "react";

import { disallowedPropsFunctionality } from '../config/prop-editor-disallowed-props';

const FunctionalityEditor = ({ componentProps = null, handlePropChange }) => {
  if (!componentProps) return null;
  const entries = Object.entries(componentProps);

  return (
    <>
      {entries.map(([propName, propValue], index) => {
        if (disallowedPropsFunctionality.some(val => val == propName)) return null;
        return <span>{propName}</span>
      })}
    </>
  )
}

export default FunctionalityEditor