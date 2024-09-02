import React from 'react';
import styles from './index.module.css';

function GridContainer({ columns, children }) {
    const gridTemplateColumns = `repeat(${columns}, 1fr)`;

    return (
        <div className={styles['grid-container']} style={{ gridTemplateColumns }}>
            {children}
        </div>
    );
}

function GridColumn({ start, end, children }) {
    const gridColumnStyle = { gridColumn: `span ${start} / span ${end}` };
  
    return (
      <div className={styles['grid-column']} style={gridColumnStyle}>
        {children}
      </div>
    );
  }

export { GridContainer, GridColumn };