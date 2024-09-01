import React from "react";

const Text = ({ text, fontSize }) => {

    return (
        <div ref={ref => connect(drag(ref))}>
            <p style={{ fontSize }}>{text}</p>
        </div>
    )
}

Text.craft = {
    rules: {
        canDrag: (node) => node.data.props.text != "Drag",
    }
}

export default Text;