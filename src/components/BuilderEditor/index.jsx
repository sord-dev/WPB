import React, { useEffect } from 'react'
import { extractComponentParameters, generateComponentID } from '../../utils'
import styles from './index.module.css'
import { GridColumn } from '../Grid';

import { withInteractionHandler } from '../HOCs';

const defaultComponents = {
    text: ({ content, style }) => <p className={styles['component']} style={{...style}} >{content || 'No content'}</p>, // temporary default just so we can see something
    container: ({ children }) => <div className={styles['container']} >{children}</div>
};

function BuilderEditor({ registery, template, getAllComponents, setSelectedComponent }) {
    const mergedRegistry = Object.assign({}, registery, { ...defaultComponents });

    const renderComponent = (componentData) => {
        const ComponentToRender = mergedRegistry[componentData.type];

        if (ComponentToRender) {
            const children = renderChildren(componentData.props.children);
            const ComponentWithInteraction = withInteractionHandler(ComponentToRender, setSelectedComponent);
            const id = componentData.props?.id || generateComponentID(componentData.type);

            return (
                <GridColumn start={componentData.props?.span?.start || 12} end={componentData.props?.span?.end || 13} key={id}>
                    <ComponentWithInteraction {...componentData.props} id={id}>{children}</ComponentWithInteraction>
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