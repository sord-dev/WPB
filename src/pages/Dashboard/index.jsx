import React, { useState } from 'react'
import styles from './index.module.css'
import { FaPlus } from "react-icons/fa6";
import { Card } from './partials';
import { CreateProjectModal, Overlay } from '../../components';
import { useProjectContext, useTabContext } from '../../contexts';

export default function Dashboard() {

  const [openClose, setOpenClose] = useState(false);

  const { addTab } = useTabContext()
  const { createProject } = useProjectContext()

  return (
    <>
      <section>
        <div className={styles['top-section']}>
          <Card icon={<FaPlus />} title={"New page build"} subTitle={"Start building a new page"} action={() => setOpenClose(true)} />
          <Card icon={<FaPlus />} title={"New component"} subTitle={"Design and create a new component"} />
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