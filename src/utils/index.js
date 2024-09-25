import { nanoid } from "nanoid";

export { default as JsonRenderer } from "./json-renderer";
export * from './json-renderer';

export { default as formatCode } from './code-formatter';

export const extractComponentParameters = (componentFunction) => {
    const functionString = componentFunction.toString();
    const parameterRegex = /\(([^)]*)\)/;
    const parameterMatch = parameterRegex.exec(functionString);
    const complextrim = str => str.replace("{", "").replace("}", "").trim();

    if (parameterMatch) {
        const parametersString = parameterMatch[1];
        const parameters = parametersString.split(',').map((param) => (complextrim(param)).split(":")[0].trim());
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

export const convertInputValueToCamelCase = (value) => value.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
export const convertObjectKeysToCamelCase = (obj) => {
    const newObj = {};
    for (let key in obj) {
        const newKey = convertInputValueToCamelCase(key);
        newObj[newKey] = obj[key];
    }

    return newObj;
};

export const convertInputValueToSnakeCase = (value) => value.replace(/([A-Z])/g, (g) => `_${g.toLowerCase()}`);
export const convertObjectKeysToSnakeCase = (obj) => {
    const newObj = {};
    for (let key in obj) {
        const newKey = convertInputValueToSnakeCase(key);
        newObj[newKey] = obj[key];
    }

    return newObj;
};


export const convertInputValueToKebabCase = (value) => value.replace(/([A-Z])/g, (g) => `-${g.toLowerCase()}`);
export const convertObjectKeysToKebabCase = (obj) => {
    const newObj = {};
    for (let key in obj) {
        const newKey = convertInputValueToKebabCase(key);
        newObj[newKey] = obj[key];
    }

    return newObj;
}

export const clearPadding = (obj) => {
    delete obj.paddingTop;
    delete obj.paddingBottom;
    delete obj.paddingLeft;
    delete obj.paddingRight;
    return obj;
};

export const getEffectivePaddingValue = (styleObj, side, fallback = 0) => {
    console.log(styleObj)
    return styleObj[side] !== undefined ? parseInt(styleObj[side]) : parseInt(styleObj.padding) || fallback;
};

export const handleAlignmentChange = (handlePropChange = () => console.log("Updating prop"), type, value) => { // change the style of a component/container
    const newStyle = { ...selectedComponent.props.style, [type]: value };
    handlePropChange('style', newStyle);
};

export const handleAlignmentChanges = (handlePropChange = () => console.log("Updating prop"), newStyle) => { // mass update the style of a container, make sure to pass the new style object with all the previous styles
    handlePropChange('style', newStyle);
}