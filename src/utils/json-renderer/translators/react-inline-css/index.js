import TypeMap from '../type-maps/inline-type-map.js';
import { deduceType } from '../utils/index.js';

export default function reactInlineCss(jsonData) {
    const processNode = (node) => {
      const { type, props = {} } = node;
      const { children = [], content = "", style = {} } = props;
  
      let jsxTag;
      deduceType(node, TypeMap) ? jsxTag = deduceType(node, TypeMap) : jsxTag = 'div';
  
      // Convert the style object to a JS inline style object format
      const styleObject = JSON.stringify(style)
        .replace(/"([^"]+)":/g, '$1:') // Remove quotes around keys for JSX format
        .replace(/"/g, "'");           // Use single quotes for values in JSX
  
      // Generate JSX with inline styles
      let jsx = `<${jsxTag} id="${props.id || ""}" style={${styleObject}}>`;
  
      if (content) {
        jsx += `{${JSON.stringify(content)}}`;  // Add content within JSX braces
      }
  
      // Recursively process children
      children.forEach(child => {
        jsx += processNode(child);
      });
  
      jsx += `</${jsxTag}>`;
  
      return jsx;
    };
  
    return processNode(jsonData.content);
  }
  