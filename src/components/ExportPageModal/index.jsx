import React, { useEffect, useState } from "react";
import styles from "./index.module.css";

function CreateProjectModal({ exportProject, tabs = [], display = () => {} }) {
    const [exportFormat, setExportFormat] = useState("html-inline-css");
    const [tabToExport, setTabToExport] = useState(tabs[0] || "");
    const [fullProject, setFullProject] = useState(false);
    const [preview, setPreview] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleExportProject = () => {
        if (!exportFormat) {
            setErrorMessage("Please select an export format");
            return;
        }

        if (typeof exportFormat !== 'string') {
            setErrorMessage("Export Project value is incorrect");
            console.error("Export Project value is incorrect");
            console.log(exportFormat);
            return;
        }

        setErrorMessage("");
        if(fullProject) {
            preview ? display(exportProject(exportFormat), exportFormat) : exportProject(exportFormat);
        } else {
            preview ? display(exportProject(exportFormat, tabToExport), exportFormat) : exportProject(exportFormat, tabToExport);
        }
    }

    return (
        <>
            <div className={styles["export-project"]}>
                <h1>Export Project</h1>

                <div className={styles['input-fields']}>
                    <div className={styles["input-field"]}>
                        <span>Export Format</span>

                        <select onChange={e => setExportFormat(e.target.value)}>
                            <option value="html-inline-css">HTML JS (Inline CSS)</option>
                            <option value="react-inline-css">React (Inline CSS)</option>
                        </select>

                    </div>

                    <div className={styles["input-field"]}>
                        <span>Tab to Export</span>

                        <select onChange={e => setTabToExport(e.target.value)} disabled={fullProject}>
                            {tabs.map((tab, index) => (
                                <option key={index + tab} value={tab}>{tab}</option>
                            ))}
                        </select>
                    </div>


                    <div className={styles["checkbox-fields"]}>
                        <div className={styles['checkbox-field']} value={fullProject} onChange={() => setFullProject(prev => !prev)}>
                            <span>Export full project</span>
                            <input type="checkbox" />
                        </div>

                        <div className={styles['checkbox-field']} value={fullProject} onChange={() => setPreview(prev => !prev)}>
                            <span>Preview Export</span>
                            <input type="checkbox" />
                        </div>
                    </div>



                </div>

                {errorMessage && (
                    <div className={styles["error-message"]}>
                        <p>{errorMessage}</p>
                    </div>
                )}

                <button className={styles["submit"]} onClick={handleExportProject}>
                    Export
                </button>
            </div>
        </>
    );
}

export default CreateProjectModal;
