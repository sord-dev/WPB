import styles from '../index.module.css'
import { ColorField, PaddingField } from '../components';
import { useStyle } from '../../../hooks/useStyle';
import { clearPadding } from '../../../utils';

const defaultContainerStyles = {
  margin: "0px",
  padding: "0px",
  backgroundColor: "transparent"
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
    </div>
  );
};

export default ContainerStylingEditor