import React from 'react'
import { useExportContext } from '../../contexts/ExportContext';

import { formatCode } from '../../utils';

import styles from './index.module.css'

function ExportTestingGround() {
  const [showCode, setShowCode] = React.useState(false);
  const { exportedData } = useExportContext();
  const isArr = Array.isArray(exportedData.dat);

  return (
    <div className={styles["container"]}>

      <div className={styles["meta-data"]}>
        <p>Export Type: {exportedData.type}</p>
        <p>Pages {isArr ? exportedData.dat.length : 1}</p>
        <button onClick={() => setShowCode(!showCode)}>Toggle Code</button>
      </div>

      <main>
        <PagePreview showCode={showCode} data={exportedData.dat} />
      </main>
    </div>
  )
}

const PagePreview = ({ showCode, data }) => {
  const CodeView = (code) => {
    if (Array.isArray(code)) {

      return code.map((c, i) => {
        return (
          <div>
            <h3>Page {i + 1}</h3>
            <pre key={i}>{c}</pre>
          </div>
        )
      })

    }

    return <pre>{code}</pre>
  }

  const PageRender = (html) => {
    if (Array.isArray(html)) {
      return html.map((h, i) => <div key={i} dangerouslySetInnerHTML={{ __html: h }} />)
    }

    return <div dangerouslySetInnerHTML={{ __html: html }} />
  }


  return (
    <>
      {showCode ? CodeView(data) : PageRender(data)}
    </>
  )
}

export default ExportTestingGround