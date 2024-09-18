
export const deduceType = (node, TypeMap) => {
    if(!TypeMap) throw new Error('TypeMap is required');
    
    const { type } = node;
    if (type) return TypeMap[type];
    return null;
}

export const processNodeProps = (node, TypeMap) => {
  const { params } = deduceType(node, TypeMap);
  const { props } = node;

  const processed = {};

  params.forEach(param => {
    if (props[param] === undefined) {
      console.error(`Parameter "${param}" missing for node: ${JSON.stringify(node)}`);
    }

    if (props[param] && param == "style") {
      processed[param] = JSON.stringify(props[param])
        .replace(/"([^"]+)":/g, '$1:') // Remove quotes around keys for JSX format
        .replace(/"/g, "'");           // Use single quotes for values in JSX;
    }

    if (props[param] && param == "content") {
      processed[param] = props[param];
    }
  });

  return processed;
}