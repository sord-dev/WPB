import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { FaPlus } from "react-icons/fa6";
import { Card, ProjectCard } from './partials';
import { CreateProjectModal, Overlay } from '../../components';
import { ContextMenuProvider, useProjectContext, useTabContext } from '../../contexts';
import useShortcut from '../../hooks/useShortcut';
import useRetrieveProjects from '../../hooks/useRetrieveProjects';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [openClose, setOpenClose] = useState(false);
  const { addTab } = useTabContext()
  const navigate = useNavigate()

  const { projects, error } = useRetrieveProjects()
  const { createProject, selectProject } = useProjectContext()

  useShortcut([
    { keyCombo: { ctrlKey: true, key: "n" }, action: () => setOpenClose(true) },
  ]);


  return (
    <>
      <section>
        <div className={styles['top-section']}>
          <Card icon={<FaPlus />} title={"New page build"} subTitle={"Start building a new page"} action={() => setOpenClose(true)} />
          <Card icon={<FaPlus />} title={"New component"} subTitle={"Design and create a new component"} action={() => navigate('/component-builder')} />
        </div>

        <div className={styles['projects-section']}>
          {error && <div>{error}</div>}
          <ContextMenuProvider>
            {projects.map((project, index) => {
              const amountOfPages = Object.keys(project.pages).length;
              return <ProjectCard
                key={index}
                title={project.projectName}
                filePath={project.filePath}
                subTitle={`${amountOfPages} ${amountOfPages > 1 ? "pages" : "page"}`}
                id={index}
              />
            })}
          </ContextMenuProvider>
        </div>

      </section>
      {openClose && (
        <Overlay openClose={setOpenClose}>
          <CreateProjectModal
            createProject={createProject}
            openClose={setOpenClose}
            addTab={addTab}
          />
        </Overlay>
      )}
    </>
  )
}