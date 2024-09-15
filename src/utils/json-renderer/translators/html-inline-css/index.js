import { convertInputValueToKebabCase } from '../../../index.js';

import TypeMap from '../type-maps/inline-type-map.js';
import { deduceType } from '../utils/index.js';

export default function htmlInlineCss(jsonData) {
    const processNode = (node) => {
        const { props = {} } = node;
        const { children = [], content = "", style = {} } = props;

        let htmlTag;
        deduceType(node, TypeMap) ? htmlTag = deduceType(node, TypeMap) : htmlTag = 'div';

        // Convert the style object to an inline style string
        const styleString = Object.entries(style)
            .map(([key, value]) => `${convertInputValueToKebabCase(key)}: ${value}`)
            .join("; ");

        // Generate HTML with inline styles
        let html = `<${htmlTag} id="${props.id || ""}" style="${styleString}">`;

        if (content) {
            html += content;
        }

        // Recursively process children
        children.forEach(child => {
            html += processNode(child);
        });

        html += `</${htmlTag}>`;

        return html;
    };

    console.log(jsonData);

    return generateBaseHTML(processNode(jsonData.content), jsonData?.tab || null);
}

const generateBaseHTML = (html, title = "Untitled") => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
    </head>
    <body>
        ${html}
    </body>
    </html>
    `;
}
