import React, { useEffect } from 'react';

import { TextStylingEditor, ElementPropsEditor } from './partials';
import { fontSizeOptions, textAlignmentOptions } from './config';

function BuilderComponentStateEditor({ selectedComponent = null, updateComponent = (selectedComponent, updatedProps) => { } }) {
    if (!selectedComponent) return null;
    if (!selectedComponent.props) throw new Error("Selected component does not have props");
    const componentType = selectedComponent.type;

    const [data, setData] = React.useState(selectedComponent.props);

    const handlePropChange = (propName, propValue) => {
        updateComponent(selectedComponent, { [propName]: propValue });
    };

    const handleAlignmentChange = (type, value) => {
        const newStyle = { ...selectedComponent.props.style, [type]: value };
        handlePropChange('style', newStyle);
    };

    useEffect(() => {
        console.log(`DEBUG - selected new component, should rerender`);
        setData(selectedComponent.props);
    }, [selectedComponent]);

    return (
        <div>
            <ElementPropsEditor componentProps={data} handlePropChange={handlePropChange} />
            {componentType == "text" && <TextStylingEditor handleAlignmentChange={handleAlignmentChange} defaultColor={data?.style.color} {...{ fontSizeOptions, textAlignmentOptions}} />}
        </div>
    )
}

export default BuilderComponentStateEditor;
