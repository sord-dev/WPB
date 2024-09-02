export const findElement = (template, elementType, elementProps) => {
    if (matchesProps(template.props, elementProps)) {
        return template;
    }

    if (template.props.children) {
        for (let child of template.props.children) {
            const foundElement = findElement(child, elementType, elementProps);
            if (foundElement) {
                return foundElement;
            }
        }
    }

    return null;
};

export const matchesProps = (props1, props2) => {
    return props1.id === props2.id;
};

export const appendElement = (template, newElement, parent) => {
    const newTemplate = JSON.parse(JSON.stringify(template)); // Create a copy
    const parentElement = findElement(newTemplate, parent.type, parent.props);
    console.log("DEBUG - Parent element:", parentElement);  

    if (parentElement) {
        parentElement.props.children.push(newElement);
    } else {
        // Handle the case where the parent element is not found
        newTemplate.props.children.push(newElement);
    }

    return newTemplate;
};

export const deleteElement = (template, elementType, elementProps) => {
    const newTemplate = JSON.parse(JSON.stringify(template)); // Create a copy
    const elementToDelete = findElement(newTemplate, elementType, elementProps);

    if (elementToDelete) {
        const parentIndex = elementToDelete.parent.children.indexOf(elementToDelete);
        elementToDelete.parent.children.splice(parentIndex, 1);
    }

    return newTemplate;
};

export const updateElement = (template, elementType, elementProps, newProps) => {
    const newTemplate = JSON.parse(JSON.stringify(template)); // Create a copy
    const elementToUpdate = findElement(newTemplate, elementType, elementProps);

    if (elementToUpdate) {
        const merged = Object.assign({}, elementToUpdate.props, newProps);

        elementToUpdate.props = merged;
    }

    return newTemplate;
};