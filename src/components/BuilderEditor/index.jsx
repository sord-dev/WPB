import React, { useEffect } from 'react'
import { extractComponentParameters, generateComponentID } from '../../utils'
import { GridColumn } from '../Grid';

import { withInteractionHandler } from '../HOCs';
import { Button, Container, Link, Text, Wrapper } from '../user';

const defaultComponents = { // TODO - Figure out how to move this to a place in which it can be shared between different pages (BuilderEditor and ComponentBuilder)
    text: Text,
    container: Container,
    wrapper: Wrapper,
    button: Button,
    link: Link
};

function BuilderEditor({ registery, template, getAllComponents, setSelectedComponent, selectedComponent }) {
    const mergedRegistry = Object.assign({}, registery, { ...defaultComponents });

    const renderComponent = (componentData) => {
        const ComponentToRender = mergedRegistry[componentData?.type];

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

    useEffect(() => {
        const componentParameters = Object.entries(mergedRegistry).map(([name, component]) => ({
            name: name.split(":")[0] || name,
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