import { useStyle } from '../../../hooks/useStyle';
import styles from '../index.module.css'
import { ColorField, PaddingField, StyleField } from '../components';
import { clearPadding } from '../../../utils';

const defaultTextStyles = {
  color: "#C0C0C0",
  fontSize: "16px",
  textAlign: "left",
  padding: "0px",
  textTransform: "unset",
  textDecoration: "unset",
  fontWeight: "unset",
};

const TextStylingEditor = ({ componentStyles, handleAlignmentUpdate, styleTypes }) => {
  const [style, updateStyle] = useStyle(componentStyles, defaultTextStyles);

  const handleStyleChange = (styleKey, value) => {
    const newStyle = { ...style, [styleKey]: value };
    if (styleKey === 'padding') {
      const clearedStyles = clearPadding(newStyle);
      updateStyle(clearedStyles);
      handleAlignmentUpdate(clearedStyles, true); // Bulk change
    } else {
      updateStyle(styleKey, value);
      handleAlignmentUpdate({ [styleKey]: value });
    }
  };

  //textTransformOptions, textDecorationOptions, fontWeightOptions
  
  return (
    <div className={styles['styling-editor']}>
      <StyleField title="Align" options={styleTypes.textAlignmentOptions} activeValue={style.textAlign} onChange={(val) => handleStyleChange("textAlign", val)} />
      <StyleField title="Font Size" options={styleTypes.fontSizeOptions} activeValue={style.fontSize} onChange={(val) => handleStyleChange("fontSize", val)} />
      <StyleField title="Text Transform" options={styleTypes.textTransformOptions} activeValue={style.textTransform} onChange={(val) => handleStyleChange("textTransform", val)} />
      <StyleField title="Text Decoration" options={styleTypes.textDecorationOptions} activeValue={style.textDecorations} onChange={(val) => handleStyleChange("textDecoration", val)} />
      <StyleField title="Font Weight" options={styleTypes.fontWeightOptions} activeValue={style.fontWeight} onChange={(val) => handleStyleChange("fontWeight", val)} />
      <PaddingField paddingSizes={styleTypes.paddingSizes} activePadding={style} onChange={handleStyleChange} />
      <ColorField color={style.color} onChange={(val) => handleStyleChange("color", val)} />
    </div>
  );
}

export default TextStylingEditor
