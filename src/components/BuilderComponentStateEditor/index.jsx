import React from 'react'

import styles from './index.module.css'

function BuilderComponentStateEditor({ selectedComponent = null, updateComponent = (selectedComponent, updatedProps) => { } }) {
    if (!selectedComponent) return null;
    if (!selectedComponent.props) throw new Error("Selected component does not have props");
    const entries = Object.entries(selectedComponent.props);

    const handlePropChange = (propName, propValue) => {
        console.log(`DEBUG - Updating ${propName} to ${propValue}`);
        updateComponent(selectedComponent, { [propName]: propValue });
    }

    return (
        <div>
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
        </div>
    )
}

const ComponentID = ({ id }) => (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        <label>id</label>
        <p><code>{id}</code></p>
    </div>
);

const TextState = ({ propName, propValue, onChange }) => {
    return (
        <div className={styles["text-state"]}>
            <label>{propName}</label>
            <input type="text" defaultValue={propValue} onChange={(e) => onChange(propName, e.target.value)} />
        </div>
    )
};

export default BuilderComponentStateEditor