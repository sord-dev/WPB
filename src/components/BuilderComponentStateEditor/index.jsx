import React from 'react';
import styles from './index.module.css'

import { fontSizeOptions, textAlignmentOptions, paddingSizes, textTransformOptions, textDecorationOptions, fontWeightOptions } from './config';
import { PropertyEditor, ContainerStylingEditor, TextStylingEditor, ButtonStylingEditor } from './partials';

function BuilderComponentStateEditor({ selectedComponent = null, updateComponent = (selectedComponent, updatedProps) => { }, deleteComponent = (selectedComponent) => { } }) {
    if (!selectedComponent) return null;
    if (!selectedComponent.props) throw new Error("Selected component does not have props");
    const componentType = selectedComponent.type;
    const componentProps = selectedComponent.props;

    const handlePropChange = (propName, propValue) => { // propName is the key of the prop, propValue is the value of the prop
        updateComponent(selectedComponent, { [propName]: propValue });
    };

    const handleAlignmentUpdate = (newStyles, isBulkUpdate = false) => {
        if (isBulkUpdate) {
            handlePropChange('style', newStyles);
        } else {
            const updatedStyle = { ...selectedComponent.props.style, ...newStyles };
            handlePropChange('style', updatedStyle);
        }
    };

    return (
        <>
            <PropertyEditor {...{ componentProps, handlePropChange }} />
            {componentType == "text" && <TextStylingEditor {...{ componentStyles: componentProps.style, handleAlignmentUpdate, styleTypes: {...getEditorProps("text")} }} />}
            {componentType == "container" && <ContainerStylingEditor {...{ containerStyles: componentProps.style, handleAlignmentUpdate, styleTypes: {...getEditorProps("container")} }} />}
            {componentType == "button" && <ButtonStylingEditor {...{ buttonStyles: componentProps.style, handleAlignmentUpdate, styleTypes: {...getEditorProps("button")} }} />}
            {componentType != "wrapper" && <ComponentGeneralControls {...{ deleteComponent: () => deleteComponent(selectedComponent) }} />}
        </>
    )
}

const ComponentGeneralControls = ({ deleteComponent }) => {
    return (
        <button className={styles['delete-btn']} onClick={() => deleteComponent()}>Delete Component</button>
    )
}

const getEditorProps = (componentType) => {
    switch (componentType) {
        case "text":
        case "link":
        case "button":
            return { fontSizeOptions, textAlignmentOptions, paddingSizes, textTransformOptions, textDecorationOptions, fontWeightOptions };
        case 'container':
            return { paddingSizes }
        default:
        return {};
    }
};

export default BuilderComponentStateEditor;
