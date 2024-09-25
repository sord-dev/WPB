import { convertInputValueToKebabCase } from '../../../index.js';

import TypeMap from '../type-maps/inline-type-map.js';
import { deduceType, processNodeProps } from '../utils/index.js';

const generateHTMLArg = (key, value) => {
    return `${key}="${value}";`;
}

const S_TAGS = {
    "a": "href",
    "img": "src"
}

export default function htmlInlineCss(jsonData) {
    const processNode = (node) => {
        const { props = {} } = node;
        const { children = [], style = {} } = props;

        let htmlTag;

        let styleObject;
        let content;

        ({ elem: htmlTag } = deduceType(node, TypeMap));
        ({ style: styleObject, content: content } = processNodeProps(node, TypeMap)); // extracting the style and content keys from the node


        // Convert the style object to an inline style string
        const styleString = Object.entries(style)
            .map(([key, value]) => `${convertInputValueToKebabCase(key)}: ${value}`)
            .join("; ");

        // Generate HTML with inline styles
        const sTag = S_TAGS[htmlTag]; // special tag
        let html = `<${htmlTag} ${generateHTMLArg("id", props.id || "")} ${sTag ? generateHTMLArg(sTag, props[sTag]) : ""} ${styleString ? generateHTMLArg("style", styleString) : ""}>
        `;

        if (content) {
            html += content;
        }

        // Recursively process children
        children.forEach(child => {
            html += processNode(child);
        });

        html += `</${htmlTag}>
        `; // newline for other tags

        return html;
    };

    console.log(jsonData);

    return generateBaseHTML(processNode(jsonData.content), jsonData?.tab || "Untitled");
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
