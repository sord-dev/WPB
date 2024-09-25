import React from "react";
import styles from "../index.module.css";
import StylingInput from "./StylingInput";

const ColorField = ({ color, onChange, label = "Color" }) => (
  <div className={styles["styling-field"]}>
    <span>{label}</span>
    <div className={styles["styling-inputs"]}>
      <StylingInput
        type="text"
        value={color}
        onChange={onChange}
        className={"input"}
        readOnly
      />
      <StylingInput
        type="color"
        value={color}
        onChange={onChange}
        className={"color-picker"}
      />
    </div>
  </div>
);

export default ColorField;
