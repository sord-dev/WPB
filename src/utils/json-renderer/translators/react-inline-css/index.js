import TypeMap from '../type-maps/inline-type-map.js';
import { deduceType, processNodeProps } from '../utils/index.js';

export default function reactInlineCss(jsonData) {
  const processNode = (node) => {
    const { props = {} } = node;
    const { children = [] } = props;

    let jsxTag;
    let nodeParams;

    let styleObject;
    let content;
    
    ({ elem: jsxTag, params: nodeParams } = deduceType(node, TypeMap));
    ({ style: styleObject, content: content } = processNodeProps(node, TypeMap));

    // Generate JSX with inline styles
    let jsx = `<${jsxTag} 
    id="${props.id || ""}" 
    style={${styleObject}}
    ${jsxTag == "a" ? `href=${props.href}` : ''}
    ${jsxTag == "img" ? `src=${props.src}` : ''}>`;

    jsxTag == "button" && console.log(jsx);
    
    if (content) {
      jsx += `${content}`;  // Add content within JSX braces
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
