import React, { useEffect } from 'react'
import { extractComponentParameters, generateComponentID } from '../../utils'
import styles from './index.module.css'
import { GridColumn } from '../Grid';

const defaultComponents = {
    text: ({ content, style }) => <p className={styles['component']} style={style} >{content || 'No content'}</p>, // temporary default just so we can see something
    container: ({ children }) => <div >{children}</div>
};


const withClickHandler = (WrappedComponent, setSelectedComponent) => ({ ...props }) => {
    const [hovered, setHovered] = React.useState(false);

    const determineDepth = (props) => {
        const depth = props.children?.length || 0; // Get the number of children
        return depth === 0 ? 0 : depth; // If the element has no children, return 0
    }

    const handleClick = () => {
        const depth = determineDepth(props); // Get the number of children
        const grammar = depth == 1 ? { n: depth, c: 'child' } : depth > 1 ? { n: depth, c: 'children' } : { n: 0, c: 'children' };
        const message = `DEBUG - Element clicked: ${props.id} with ${grammar.n} ${grammar.c}`;
        console.log(message);

        if (!depth) { // If the element has no children
            const element = { type: props.id.split("-")[0], props };  // Create a new element
            setSelectedComponent(element); // Set the selected component
        }
    };

    const handleMouseOver = () => {
        const depth = determineDepth(props); // Get the number of children
        if (!depth) { // If the element has no children
            setHovered(true);
        }
    };

    const handleMouseOut = () => {
        setHovered(false);
    }

    const type = props.id.split("-")[0];

    return (
        <span
            className={styles["component-border"]}
            onClick={handleClick}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseOut}
            style={{ margin: "inherit", padding: "inherit" }} >
            {hovered && <div className={styles["type-tag"]}>{type}</div>}
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
            return (
                <GridColumn start={componentData.props?.span?.start || 12} end={componentData.props?.span?.end || 13} key={id}>
                    <ComponentWithClickHandler {...componentData.props} id={id}>{children}</ComponentWithClickHandler>
                </GridColumn>
            );
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