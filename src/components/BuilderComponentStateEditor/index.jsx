import React from 'react';
import styles from './index.module.css'

import { TextStylingEditor, PropertyEditor, ContainerStylingEditor } from './partials';
import { fontSizeOptions, textAlignmentOptions, paddingSizes } from './config';

function BuilderComponentStateEditor({ selectedComponent = null, updateComponent = (selectedComponent, updatedProps) => { }, deleteComponent = (selectedComponent) => { } }) {
    if (!selectedComponent) return null;
    if (!selectedComponent.props) throw new Error("Selected component does not have props");
    const componentType = selectedComponent.type;
    const componentProps = selectedComponent.props;

    const handlePropChange = (propName, propValue) => { // propName is the key of the prop, propValue is the value of the prop
        updateComponent(selectedComponent, { [propName]: propValue });
    };

    const handleAlignmentChange = (type, value) => { // change the style of a component/container
        console.log('handleAlignmentChange', { type, value });
        const newStyle = { ...selectedComponent.props.style, [type]: value };
        handlePropChange('style', newStyle);
    };

    const handleAlignmentChanges = (newStyle) => { // mass update the style of a container, make sure to pass the new style object with all the previous styles
        handlePropChange('style', newStyle);
    }

    return (
        <>
            <PropertyEditor {...{ componentProps, handlePropChange }} />
            {componentType == "text" && <TextStylingEditor {...{ componentStyles: componentProps.style, handleAlignmentChange, fontSizeOptions, textAlignmentOptions }} />}
            {componentType == "container" && <ContainerStylingEditor {...{ containerStyles: componentProps.style, paddingSizes, handleAlignmentChanges, handleAlignmentChange }} />}
            {componentType != "wrapper" && <ComponentGeneralControls {...{ deleteComponent: () => deleteComponent(selectedComponent) }} />}
        </>
    )
}

const ComponentGeneralControls = ({ deleteComponent }) => {
    return (
        <button className={styles['delete-btn']} onClick={() => deleteComponent()}>Delete Component</button>
    )
}

export default BuilderComponentStateEditor;
