import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

function Overlay({ children, openClose }) {
  const [mouseDownInside, setMouseDownInside] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        openClose(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openClose]);

  const handleMouseDown = (event) => {
    if (event.target !== event.currentTarget) {
      setMouseDownInside(true);
    }
  };

  const handleMouseUp = (event) => {
    if (event.target === event.currentTarget && !mouseDownInside) {
      openClose(false);
    }
    setMouseDownInside(false);
  };

  return (
    <div
      className={styles["overlay"]}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <div style={{ position: "relative" }}>{children}</div>
    </div>
  );
}

export default Overlay;
