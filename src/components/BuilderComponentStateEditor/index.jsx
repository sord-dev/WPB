import React from 'react';

import { TextStylingEditor, ElementPropsEditor } from './partials';
import { fontSizeOptions, textAlignmentOptions } from './config';

function BuilderComponentStateEditor({ selectedComponent = null, updateComponent = (selectedComponent, updatedProps) => { } }) {
    if (!selectedComponent) return null;
    if (!selectedComponent.props) throw new Error("Selected component does not have props");
    const componentType = selectedComponent.type;

    const handlePropChange = (propName, propValue) => {
        updateComponent(selectedComponent, { [propName]: propValue });
    };

    const handleAlignmentChange = (type, value) => {
        const newStyle = { ...selectedComponent.props.style, [type]: value };
        handlePropChange('style', newStyle);
    };

    return (
        <div>
            <ElementPropsEditor componentProps={selectedComponent.props} handlePropChange={handlePropChange} />
            {componentType == "text" && <TextStylingEditor handleAlignmentChange={handleAlignmentChange} {...{ fontSizeOptions, textAlignmentOptions}} />}
        </div>
    )
}

export default BuilderComponentStateEditor;
