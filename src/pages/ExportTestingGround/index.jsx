import React from 'react'
import { useExportContext } from '../../contexts/ExportContext';

import styles from './index.module.css'

function ExportTestingGround() {
  const [showCode, setShowCode] = React.useState(false);
  const { exportedData } = useExportContext();


  return (
    <div className={styles["container"]}>

      <div className={styles["meta-data"]}>
        <h1>Export Testing Ground</h1>
        <p>Export Type: {exportedData.type}</p>
        <button onClick={() => setShowCode(!showCode)}>Toggle Code</button>
      </div>

      <main>
        {showCode ? <pre>{exportedData.dat}</pre> : <div dangerouslySetInnerHTML={{ __html: exportedData.dat }} />}
      </main>
    </div>
  )
}

export default ExportTestingGround