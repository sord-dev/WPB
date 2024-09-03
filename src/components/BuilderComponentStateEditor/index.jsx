import React from 'react';

import { TextStylingEditor, ElementPropsEditor } from './partials';
import { fontSizeOptions, textAlignmentOptions } from './config';

function BuilderComponentStateEditor({ selectedComponent = null, updateComponent = (selectedComponent, updatedProps) => { } }) {
    if (!selectedComponent) return null;
    if (!selectedComponent.props) throw new Error("Selected component does not have props");
    const componentType = selectedComponent.type;
    const componentProps = selectedComponent.props;

    const handlePropChange = (propName, propValue) => {
        updateComponent(selectedComponent, { [propName]: propValue });
    };

    const handleAlignmentChange = (type, value) => {
        const newStyle = { ...selectedComponent.props.style, [type]: value };
        handlePropChange('style', newStyle);
    };

    return (
        <>
            <ElementPropsEditor {...{componentProps, handlePropChange }} />
            {componentType == "text" && <TextStylingEditor handleAlignmentChange={handleAlignmentChange} defaultColor={componentProps.style?.color} {...{ fontSizeOptions, textAlignmentOptions}} />}
        </>
    )
}

export default BuilderComponentStateEditor;
