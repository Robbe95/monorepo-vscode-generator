import { Project } from 'ts-morph'

import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'

const mapOfProjectPaths = new Map<string, Project>()

export function getTsProject(path: string): Project {
  const workspaceRoot = getRootFolder()

  if (mapOfProjectPaths.has(path)) {
    return mapOfProjectPaths.get(path) as Project
  }

  const projectToAdd = new Project({
    tsConfigFilePath: `${workspaceRoot}/${path}/tsconfig.json`,
  })

  mapOfProjectPaths.set(path, projectToAdd)

  return projectToAdd
}
