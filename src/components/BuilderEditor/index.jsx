import React from 'react'

const defaultComponents = {
    text: ({ content, style }) => <p style={style} >{content}</p>,
    container: ({ children }) => <div>{children}</div>
};

function BuilderEditor({ registery, template }) {
    const mergedRegistery = Object.assign({}, registery, { ...defaultComponents });

    const renderComponent = (componentData) => {
        const ComponentToRender = mergedRegistery[componentData.type];

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

    return (
        <>
            {renderPage(template)}
        </>
    )
}

export default BuilderEditor