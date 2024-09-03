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
    const children = template.props.children;
  
    for (const child of children) {
      if (child.props && matchesProps(child.props, elementProps)) {
        return tree; // Found the parent
      }
  
      const parent = findParent(elementId, child);
      if (parent) {
        return parent; // Found the parent in a child
      }
    }
  
    return null; // No parent found
  }

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
    const elementToDelete = findElement(newTemplate, elementProps);

    if (elementToDelete) {
        const parentIndex = elementToDelete.parent.children.indexOf(elementToDelete);
        elementToDelete.parent.children.splice(parentIndex, 1);
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