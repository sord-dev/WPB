import React, { useEffect, useState } from 'react'
import { convertObjectKeysToCamelCase } from '../utils'
import { invoke } from '@tauri-apps/api'

import { useProjectContext } from '../contexts'

function useRetrieveProjects() {
    const { projects, setProjects } = useProjectContext()
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const loadedProjects = await invoke("scan_for_projects")
                const parsed = JSON.parse(loadedProjects);
                const cammeled = parsed.map((project) => convertObjectKeysToCamelCase(project));
                setProjects(cammeled)
            } catch (error) {
                console.error("Error loading projects: ", error)
                setError(error)
            }
        }

        loadProjects()
    }, [])

    return { projects, error }
}

export default useRetrieveProjects