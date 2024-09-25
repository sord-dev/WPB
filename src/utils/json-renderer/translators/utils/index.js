
export const deduceType = (node, TypeMap) => {
    if(!TypeMap) throw new Error('TypeMap is required');
    
    const { type } = node;
    if (type) return TypeMap[type];
    else throw new Error(`Type not found for node: ${JSON.stringify(node)}`);
}

export const processNodeProps = (node, TypeMap) => {
  const { params } = deduceType(node, TypeMap); // extract the parameters for the node type
  const { props } = node; // extract the props for the node

  const processed = {};

  params.forEach(param => { // for each parameter in the node type
    if (props[param] === undefined) { // if the parameter is missing from the props
      console.error(`Parameter "${param}" missing for node: ${JSON.stringify(node)}`);
    }

    if (props[param] && param == "style") { // if the parameter is style
      processed[param] = JSON.stringify(props[param])
        .replace(/"([^"]+)":/g, '$1:') 
        .replace(/"/g, "'");
    }

    if (props[param] && param == "content") { // if the parameter is content - IMPORTANT - TEXT ONLY WORKS WITH THIS VALUE
      processed[param] = props[param];
    }
  });

  return processed;
}