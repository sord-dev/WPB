import React, { useEffect } from 'react'
import { useExportContext } from '../../contexts/ExportContext';

import styles from './index.module.css'
import { useProjectContext } from '../../contexts/ProjectContext';
import { usePageContext } from '../../contexts/PageContext';

function ExportTestingGround() {
  const [showCode, setShowCode] = React.useState(false);
  const { exportedData } = useExportContext();
  const {  activePage, pageIndex } = usePageContext()


  return (
    <div className={styles["container"]}>

      <div className={styles["meta-data"]}>
        <h3>Tab Name: {activePage}</h3>
        <p>Pages {pageIndex.length}</p>
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