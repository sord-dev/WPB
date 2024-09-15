import TypeMap from './type-map.js';

const deduceType = (node) => {
    const { type } = node;
    if (type) return TypeMap[type];
    return 'text';
}

export default function htmlInlineCss(jsonData) {
    const processNode = (node) => {
        const { props = {} } = node;
        const { children = [], content = "", style = {} } = props;

        let htmlTag;
        deduceType(node) ? htmlTag = deduceType(node) : htmlTag = 'div';

        // Convert the style object to an inline style string
        const styleString = Object.entries(style)
            .map(([key, value]) => `${key}: ${value}`)
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

    return processNode(jsonData.content);
}
