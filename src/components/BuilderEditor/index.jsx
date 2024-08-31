import React, { useEffect } from 'react'
import { extractComponentParameters } from './utils';

const defaultComponents = {
    text: ({ content, style }) => <p style={style} >{content}</p>,
    container: ({ children }) => <div>{children}</div>
};

function BuilderEditor({ registery, template, getAllComponents }) {
    const mergedRegistry = Object.assign({}, registery, { ...defaultComponents });

    const renderComponent = (componentData) => {
        const ComponentToRender = mergedRegistry[componentData.type];

        if (ComponentToRender) {
            return <ComponentToRender {...componentData.props}>{renderChildren(componentData.children)}</ComponentToRender>;
        }

        return null; // Handle invalid components
    };

    const renderChildren = (childrenData) => {
        return childrenData?.map((childData) => renderComponent(childData));
    };

    const renderPage = (pageData) => {
        return renderComponent(pageData);
    };

    useEffect(() => {
        const componentParameters = Object.entries(mergedRegistry).map(([name, component]) => ({
            name,
            parameters: extractComponentParameters(component),
        }));

        getAllComponents(componentParameters);
    }, [mergedRegistry]);

    return (
        <>
            {renderPage(template)}
        </>
    )
}

export default BuilderEditor