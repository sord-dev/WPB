export const findElement = (template, elementProps) => {
    if (matchesProps(template.props, elementProps)) {
        return template;
    }

    if (template.props.children) {
        for (let child of template.props.children) {
            const foundElement = findElement(child, elementProps);
            if (foundElement) {
                return foundElement;
            }
        }
    }

    return null;
};

export const findParent = (template, elementProps) => {
    if (!template || !elementProps) {
        throw new Error('Invalid arguments: template and elementProps must be provided.');
    }

    const traverse = (node, parent) => {
        if (!node) {
            return null; // Handle null or undefined nodes
        }

        if (matchesProps(node.props, elementProps)) {
            return parent;
        }

        if (node.props.children) {
            for (const child of node.props.children) {
                const result = traverse(child, node);
                if (result) {
                    return result;
                }
            }
        }

        return null;
    };

    return traverse(template, null);
};


export const matchesProps = (props1, props2) => {
    return props1.id === props2.id;
};

export const appendElement = (template, newElement, parent) => {
    const newTemplate = JSON.parse(JSON.stringify(template)); // Create a copy
    const parentElement = findElement(newTemplate, parent.props);
    console.log("DEBUG - Parent element:", parentElement);

    if (parentElement) {
        parentElement.props.children.push(newElement);
    } else {
        // Handle the case where the parent element is not found
        newTemplate.props.children.push(newElement);
    }

    return newTemplate;
};

export const deleteElement = (template, elementProps) => {
    const newTemplate = JSON.parse(JSON.stringify(template)); // Create a copy
    const parent = findParent(newTemplate, elementProps);
    console.log("DEBUG - Parent element for deletion:", parent);

    if (parent && parent.props.children) {
        const index = parent.props.children.findIndex(child => matchesProps(child.props, elementProps));
        parent.props.children.splice(index, 1);
    }

    return newTemplate;
};

export const updateElement = (template, elementProps, newProps) => {
    const newTemplate = JSON.parse(JSON.stringify(template)); // Create a copy
    const elementToUpdate = findElement(newTemplate, elementProps);

    if (elementToUpdate) {
        const merged = Object.assign({}, elementToUpdate.props, newProps);

        elementToUpdate.props = merged;
    }

    return newTemplate;
};