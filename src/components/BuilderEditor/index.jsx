import React, { useEffect } from 'react'
import { extractComponentParameters, generateComponentID } from '../../utils'
import styles from './index.module.css'

const defaultComponents = {
    text: ({ content, style }) => <p className={styles['component']} style={style} >{content || 'No content'}</p>, // temporary default just so we can see something
    container: ({ children }) => <div className={styles['container']} >{children}</div>
};


const withClickHandler = (WrappedComponent, setSelectedComponent) => ({ ...props }) => {
    const handleClick = () => {
        const depth = props.children?.length || "no"; // Get the number of children

        if (depth == "no") { // If the element has no children
            const element = { type: props.id.split("-")[0], props }

            setSelectedComponent(element); // Set the selected component
        }

        const grammar = depth == 1 ? { n: depth , c: 'child' } : depth > 1 ? { n: depth, c: 'children' } : { n: 0, c: 'children' };
        const message = `DEBUG - Element clicked: ${props.id} with ${grammar.n} ${grammar.c}`;
        console.log(message);
    };

    return (
        <span onClick={handleClick} style={{ margin: "inherit", padding:"inherit" }}>
            <WrappedComponent {...props} />
        </span>
    );
};


function BuilderEditor({ registery, template, getAllComponents, setSelectedComponent }) {
    const mergedRegistry = Object.assign({}, registery, { ...defaultComponents });

    const renderComponent = (componentData) => {
        const ComponentToRender = mergedRegistry[componentData.type];

        if (ComponentToRender) {
            const children = renderChildren(componentData.props.children);
            const ComponentWithClickHandler = withClickHandler(ComponentToRender, setSelectedComponent);
            const id = componentData.props?.id || generateComponentID(componentData.type);
            return <ComponentWithClickHandler key={id} {...componentData.props} id={id}>{children}</ComponentWithClickHandler>;
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