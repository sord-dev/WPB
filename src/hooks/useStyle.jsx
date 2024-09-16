import { useState, useEffect } from 'react';

export const useStyle = (initialStyles, defaultStyles) => {
  const [style, setStyle] = useState(initialStyles || defaultStyles);
  
  useEffect(() => {
    setStyle(initialStyles || defaultStyles);
  }, [initialStyles]);

  const updateStyle = (styleKey, value) => {
    setStyle((prev) => ({ ...prev, [styleKey]: value }));
  };

  return [style, updateStyle];
};