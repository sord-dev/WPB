import React from 'react';

import { TextStylingEditor, PropertyEditor, ContainerStylingEditor } from './partials';
import { fontSizeOptions, textAlignmentOptions, marginSizes, paddingSizes } from './config';

function BuilderComponentStateEditor({ selectedComponent = null, updateComponent = (selectedComponent, updatedProps) => { }, deleteComponent = (selectedComponent) => { } }) {
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
            <PropertyEditor {...{ componentProps, handlePropChange }} />
            {componentType == "text" && <TextStylingEditor handleAlignmentChange={handleAlignmentChange} componentStyles={componentProps.style} {...{ fontSizeOptions, textAlignmentOptions}} />}
            {componentType == "container" && <ContainerStylingEditor containerStyles={componentProps.style || {}} handleAlignmentChange={handleAlignmentChange} {...{ marginSizes, paddingSizes }} />}
            {componentType != "wrapper" && <ComponentGeneralControls deleteComponent={() => deleteComponent(selectedComponent)} />}
        </>
    )
}

const ComponentGeneralControls = ({ deleteComponent }) => {
    return (
        <div>
            <button onClick={() => deleteComponent()}>Delete</button>
        </div>
    )
}

export default BuilderComponentStateEditor;
