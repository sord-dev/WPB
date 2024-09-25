import styles from '../index.module.css';
import { BackgroundImageInput, ColorField, PaddingField, StyleField } from '../components'; // Ensure StyleField is imported
import { useStyle } from '../../../hooks/useStyle';
import { clearPadding } from '../../../utils';

const defaultContainerStyles = {
  margin: "0px",
  padding: "0px",
  backgroundColor: "transparent",
  backgroundImage: "none",
  backgroundSize: "auto",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

export const ContainerStylingEditor = ({ handleAlignmentUpdate, containerStyles, styleTypes }) => {
  const [style, updateStyle] = useStyle(containerStyles, defaultContainerStyles);

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
  
  return (
    <div className={styles['styling-editor']}>
      <PaddingField paddingSizes={styleTypes.paddingSizes} activePadding={style} onChange={handleStyleChange} />
      <ColorField label='Background Color' color={style.backgroundColor} onChange={(value) => handleStyleChange('backgroundColor', value)} />
      <BackgroundImageInput
        value={style.backgroundImage.replace(/url\(["']?/, '').replace(/["']?\)$/, '')} // Clean the URL for the input
        onChange={(value) => handleStyleChange('backgroundImage', `url(${value})`)}
      />
      <StyleField 
        title="Background Size" 
        options={styleTypes.backgroundSizeOptions} 
        activeValue={style.backgroundSize} 
        onChange={(val) => handleStyleChange("backgroundSize", val)} 
      />
      <StyleField 
        title="Background Position" 
        options={styleTypes.backgroundPositionOptions} 
        activeValue={style.backgroundPosition} 
        onChange={(val) => handleStyleChange("backgroundPosition", val)} 
      />
      <StyleField 
        title="Background Repeat" 
        options={styleTypes.backgroundRepeatOptions} 
        activeValue={style.backgroundRepeat} 
        onChange={(val) => handleStyleChange("backgroundRepeat", val)} 
      />
    </div>
  );
};

export default ContainerStylingEditor;
