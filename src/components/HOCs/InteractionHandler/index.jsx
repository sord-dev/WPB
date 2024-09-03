import React from 'react';
import styles from './index.module.css';

const withInteractionHandler = (WrappedComponent, setSelectedComponent) => ({ ...props }) => {
    const [hovered, setHovered] = React.useState(false);
    const type = props.id.split("-")[0];

    const determineDepth = (props) => {
        const depth = props.children?.length || 0; // Get the number of children
        return depth === 0 ? 0 : depth; // If the element has no children, return 0
    }

    const handleClick = (event) => {
        event.stopPropagation();
        const type = props.id.split("-")[0]; // Get the type of the element
        if (type === "wrapper") return; // Prevent the wrapper element from being selected

        const depth = determineDepth(props); // Get the number of children
        const grammar = depth == 1 ? { n: depth, c: 'child' } : depth > 1 ? { n: depth, c: 'children' } : { n: 0, c: 'children' };
        const message = `DEBUG - Element clicked: ${props.id} with ${grammar.n} ${grammar.c}`;
        console.log(message);

        const element = { type, props };  // format the element's data
        setSelectedComponent(element); // Set the selected component
    };

    const handleMouseOver = () => {
        const depth = determineDepth(props); // Get the number of children
        if (type === "wrapper") return; // Prevent the type tag from showing on the wrapper element
        if (!depth) { // If the element has no children
            setHovered(true);
        }
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