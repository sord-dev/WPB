import { useEffect, useRef, useState } from "react";
import { useContextMenu, useProjectContext } from "../../../contexts";
import styles from "../index.module.css";
import { Overlay, RenameProjectModal } from "../../../components";

export const Card = ({ icon, title, subTitle, action }) => {
  return (
    <button onClick={action} className={styles["card"]}>
      {icon && <div className={styles["card-icon"]}>{icon}</div>}

      <div className={styles["card-content"]}>
        <div className={styles["card-title"]}>{title}</div>
        <div className={styles["card-subtitle"]}>{subTitle}</div>
      </div>
    </button>
  );
};

export const ProjectCard = ({ icon, title, subTitle, filePath, id }) => {

  const { activeCard, setActiveCard, points, setPoints } = useContextMenu();
  const { selectProject, deleteProject, renameProject } = useProjectContext();

  const [openClose, setOpenClose] = useState(false);

  const cardRef = useRef(null);
  const menuRef = useRef(null);

  const menuItems = [
    {
      type: "file",
      items: [
        { label: "Open", action: () => selectProject(filePath) },
        {
          label: "Open directory",
          action: () => console.log("Open directory clicked"),
        },
      ],
    },
    {
      type: "edit",
      items: [
        { label: "Rename", action: () => setOpenClose(true) },
        {
          label: "Delete",
          action: () => {
            deleteProject(filePath);
            setActiveCard(null);
          },
        },
      ],
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        cardRef.current &&
        !cardRef.current.contains(event.target) &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setActiveCard(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setActiveCard]);

  return (
    <div
      ref={cardRef}
      onContextMenu={(e) => {
        e.preventDefault();
        setActiveCard(id);
        setPoints({ x: e.pageX, y: e.pageY });
      }}
      className={styles["project-card"]}
    >
      <button
        onClick={() => selectProject(filePath)}
        className={styles["card"]}
      >
        {icon && <div className={styles["card-icon"]}>{icon}</div>}

        <div className={styles["card-content"]}>
          <div className={styles["card-title"]}>{title}</div>
          <div className={styles["card-subtitle"]}>{subTitle}</div>
        </div>
      </button>
      {activeCard === id && (
        <>
          <div
            ref={menuRef}
            className={styles["context-menu"]}
            style={{ left: `${points.x}px`, top: `${points.y}px` }}
          >
            {menuItems.map((group, index) => (
              <ul key={index}>
                {group.items.map((item, idx) => (
                  <li key={idx}>
                    <button onClick={item.action}>{item.label}</button>
                  </li>
                ))}
              </ul>
            ))}
          </div>
          {openClose && (
            <Overlay openClose={setOpenClose}>
              <RenameProjectModal
                renameProject={renameProject}
                openClose={setOpenClose}
                filePath={filePath}
              />
            </Overlay>
          )}
        </>
      )}
    </div>
  );
};
