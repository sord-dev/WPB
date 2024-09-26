import React from 'react'
import { generateComponentID } from '../../utils'
import { GridColumn } from '../Grid';

import { withInteractionHandler } from '../HOCs';


function BuilderEditor({ registery, template, setSelectedComponent, selectedComponent }) {

    const renderComponent = (componentData) => {
        const ComponentToRender = registery[componentData?.type];

        if (ComponentToRender) {

            const selected = componentData?.props?.id === selectedComponent?.props?.id

            const children = renderChildren(componentData.props.children);
            const ComponentWithInteraction = withInteractionHandler(ComponentToRender, setSelectedComponent, selected);
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

    return (
        <>
            {renderPage(template)}
        </>
    )
}

export default BuilderEditor