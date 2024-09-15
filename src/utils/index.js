import { nanoid } from "nanoid";

export { default as JsonRenderer } from "./json-renderer";

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

export const convertObjectKeysToCamelCase = (obj) => {
    const newObj = {};
    for (let key in obj) {
        const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        newObj[newKey] = obj[key];
    }

    return newObj;
};

export const convertObjectKeysToSnakeCase = (obj) => {
    const newObj = {};
    for (let key in obj) {
        const newKey = key.replace(/([A-Z])/g, (g) => `_${g.toLowerCase()}`);
        newObj[newKey] = obj[key];
    }

    return newObj;
};

