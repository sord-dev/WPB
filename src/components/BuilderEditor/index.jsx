import React, { useEffect } from 'react'
import { extractComponentParameters, generateComponentID } from '../../utils';

const defaultComponents = {
    text: ({ content, style }) => <p style={style} >{content || 'No content'}</p>, // temporary default just so we can see something
    container: ({ children }) => <div >{children}</div>
};

function BuilderEditor({ registery, template, getAllComponents }) {
    const mergedRegistry = Object.assign({}, registery, { ...defaultComponents });

    const renderComponent = (componentData) => {
        const ComponentToRender = mergedRegistry[componentData.type];

        if (ComponentToRender) {
            const children = renderChildren(componentData.props.children);
            return <ComponentToRender key={generateComponentID(componentData.type)} {...componentData.props}>{children}</ComponentToRender>;
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

        const tick = () => getAllComponents(componentParameters);
        tick();
        const tm = setTimeout(tick, 1000);
        return () => clearTimeout(tm);
    }, []);

    return (
        <>
            {renderPage(template)}
        </>
    )
}

export default BuilderEditor