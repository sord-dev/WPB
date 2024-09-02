import React from 'react';
import styles from './index.module.css';
<<<<<<< Updated upstream
=======
import { TextState, TextStylingEditor } from './partials';
>>>>>>> Stashed changes

function BuilderComponentStateEditor({ selectedComponent = null, updateComponent = (selectedComponent, updatedProps) => {} }) {
    if (!selectedComponent) return null;
    if (!selectedComponent.props) throw new Error("Selected component does not have props");
    const entries = Object.entries(selectedComponent.props);

    const handlePropChange = (propName, propValue) => {
        updateComponent(selectedComponent, { [propName]: propValue });
    };

    const handleAlignmentChange = (type, value) => {
        const newStyle = { ...selectedComponent.props.style, [type]: value };
        handlePropChange('style', newStyle);
    };

    return (
        <div>
<<<<<<< Updated upstream
            <div style={{ display: 'flex', justifyContent: "space-between"}}>
                <button onClick={() => handleAlignmentChange("textAlign", "left")}>Align Left</button>
                <button onClick={() => handleAlignmentChange("textAlign", "center")}>Align Center</button>
                <button onClick={() => handleAlignmentChange("textAlign", "right")}>Align Right</button>
            </div>
            {entries.map(([propName, propValue], index) => {
                if (propName === "children") return null;
                if (propName === "id") return <ComponentID key={index} id={propValue} />

                if (typeof propValue === "object") {
                    return (
                        <div key={index}>
                            <label>{propName}</label>
                            <p>
                                {JSON.stringify(propValue, null, 2)}
                            </p>
                        </div>
                    );
                }

                return <TextState key={index} {...{ propName, propValue, onChange: handlePropChange }} />;
            })}
=======
            {componentType == "text" && (<TextStylingEditor handleAlignmentChange={handleAlignmentChange} />)}
            
            {entries.map(([propName, propValue], index) => {
                    if (propName === "children") return null;
                    if (propName === "id") return null;
    
                    if (typeof propValue === "object") {
                        return (
                            <div key={index}>
                                <label>{propName}</label>
                                <p>
                                    {JSON.stringify(propValue, null, 2)}
                                </p>
                            </div>
                        );
                    }
    
                    return <TextState key={index} {...{ propName, propValue, onChange: handlePropChange }} />;
                })}
>>>>>>> Stashed changes
        </div>
    )
}

export default BuilderComponentStateEditor;
