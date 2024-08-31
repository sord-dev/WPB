export const extractComponentParameters = (componentFunction) => {
    const functionString = componentFunction.toString();
    const parameterRegex = /\(([^)]*)\)/;
    const parameterMatch = parameterRegex.exec(functionString);
    const complextrim = str => str.replace("{", "").replace("}", "").trim();
  
    if (parameterMatch) {
      const parametersString = parameterMatch[1];
      const parameters = parametersString.split(',').map((param) => complextrim(param));
      return parameters;
    }
  
    return [];
  };