import React from 'react';
import styles from './index.module.css'

import { fontSizeOptions, textAlignmentOptions, paddingSizes, textTransformOptions, textDecorationOptions, fontWeightOptions } from './config';
import { PropertyEditor, ContainerStylingEditor, TextStylingEditor, ButtonStylingEditor, LinkStylingEditor, FunctionalityEditor } from './partials';
import { disallowedPropsFunctionality } from './config/prop-editor-disallowed-props';

function BuilderComponentStateEditor({
    selectedComponent = null,
    updateComponent = (selectedComponent, updatedProps) => { },
    deleteComponent = (selectedComponent) => { },
    editing = "functionality"
}) {
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
            {editing == "styling" && (
                <>
                    <PropertyEditor {...{ componentProps, handlePropChange }} />
                    <ComponentStylingEditor {...{ componentType, handleAlignmentUpdate, componentProps }} />
                </>
            )}

            {editing == "functionality" && (
                <>
                    <FunctionalityEditor {...{ componentProps, handlePropChange }} />
                </>
            )}

            <ComponentGeneralControls {...{ componentType, deleteComponent: () => deleteComponent(selectedComponent) }} />
        </>
    )
}

const ComponentStylingEditor = ({ componentType, handleAlignmentUpdate, componentProps }) => {
    return (
        <>
            {componentType == "text" && <TextStylingEditor {...{ componentStyles: componentProps.style, handleAlignmentUpdate, styleTypes: { ...getEditorProps("text") } }} />}
            {componentType == "container" && <ContainerStylingEditor {...{ containerStyles: componentProps.style, handleAlignmentUpdate, styleTypes: { ...getEditorProps("container") } }} />}
            {componentType == "button" && <ButtonStylingEditor {...{ buttonStyles: componentProps.style, handleAlignmentUpdate, styleTypes: { ...getEditorProps("button") } }} />}
            {componentType == "link" && <LinkStylingEditor {...{ linkStyles: componentProps.style, handleAlignmentUpdate, styleTypes: { ...getEditorProps("link") } }} />}
        </>
    )
}

const ComponentGeneralControls = ({ deleteComponent, componentType }) => {
    if (componentType == "wrapper") return null;
    return <button className={styles['delete-btn']} onClick={() => deleteComponent()}>Delete Component</button>
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
