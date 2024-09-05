import React from 'react'
import styles from './index.module.css'
import { FaPlus } from "react-icons/fa6";
import { Card } from './partials';

export default function Dashboard() {
  return (
    <section>
      <div className={styles['top-section']}>
        <Card icon={<FaPlus />} title={"New page build"} subTitle={"Start building a new page"} />
        <Card icon={<FaPlus />} title={"New component"} subTitle={"Design and create a new component"} />
      </div>
    </section>
  )
}