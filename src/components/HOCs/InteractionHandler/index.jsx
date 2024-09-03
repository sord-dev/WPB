import React from 'react';
import styles from './index.module.css';

const withInteractionHandler = (WrappedComponent, setSelectedComponent) => ({ ...props }) => {
    const [hovered, setHovered] = React.useState(false);
    const type = props.id.split("-")[0];

    const determineDepth = (props) => {
        const d = props.children?.length || 0; // Get the number of children
        return d === 0 ? 0 : d; // If the element has no children, return 0
    }

    const handleClick = (event) => {
        event.stopPropagation(); // Prevent the event from bubbling up, so that the parent element is not selected simultaneously
        if (type === "wrapper") return; // Prevent the wrapper element from being selected

        const element = { type, props };  // format the element's data
        setSelectedComponent(element); // Set the selected component
    };

    const handleMouseOver = (event) => {
        event.stopPropagation(); // Prevent the event from bubbling up, so that the parent element is not selected simultaneously
        if (type === "wrapper") return; // Prevent the type tag from showing on the wrapper element
        
        // if (!depth) setHovered(true); // Add this line if you want to see the type tag ONLY on elements with no children
        const depth = determineDepth(props); // Get the number of children
        setHovered(true); // comment this line if you want to see the type tag ONLY on elements with no children
    };

    const handleMouseOut = () => {
        setHovered(false);
    }

    return (
        <span
            className={styles["component-border"]}
            onClick={handleClick}
            onMouseOver={handleMouseOver}
            onMouseLeave={handleMouseOut}
            style={{ margin: "inherit", padding: "inherit" }} >
            {hovered && <div className={styles["type-tag"]}>{type}</div>}
            <WrappedComponent {...props} />
        </span>
    );
};

export default withInteractionHandler;