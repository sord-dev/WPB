import styles from '../index.module.css'
import { useState } from 'react';

export function TextStylingEditor({ handleAlignmentChange }) {
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
          <button onClick={() => handleAlignmentChange("textAlign", "left")}>Align Left</button>
          <button onClick={() => handleAlignmentChange("textAlign", "center")}>Align Center</button>
          <button onClick={() => handleAlignmentChange("textAlign", "right")}>Align Right</button>
        </div>
      </div>
      <div className={styles['styling-field']}>
        <span>Font Size</span>
        <div className={styles['styling-inputs']}>
          <button onClick={() => handleAlignmentChange("fontSize", 14)}>XS</button>
          <button onClick={() => handleAlignmentChange("fontSize", 16)}>S</button>
          <button onClick={() => handleAlignmentChange("fontSize", 18)}>M</button>
          <button onClick={() => handleAlignmentChange("fontSize", 20)}>L</button>
          <button onClick={() => handleAlignmentChange("fontSize", 24)}>XL</button>
        </div>
      </div>
      <div className={styles['styling-field']}>
        <span>Color</span>
        <div className={styles['styling-inputs']}>
          <input 
            type="text" 
            value={color} 
            onChange={(e) => handleColorChange(e.target.value)} 
            className={styles['color-input']}
            readOnly
          />
          <input 
            type="color" 
            value={color} 
            onChange={(e) => handleColorChange(e.target.value)} 
            className={styles['color-picker']}
          />
        </div>
      </div>
    </div>
  )
}
