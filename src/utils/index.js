import { nanoid } from "nanoid";

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

export const convertParamsToObject = (params) => {
    return params.map((param) => {
        if (param === "children") return { children: [] };
        if (param === "style") return { style: {} };

        return { [param]: "" };
    }).reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

export const generateComponentID = (componentName) => {
    return `${componentName}-${nanoid(8)}`;
};