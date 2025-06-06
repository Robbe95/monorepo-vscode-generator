import { Project } from 'ts-morph'

import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'

const mapOfProjectPaths = new Map<string, Project>()

export async function getTsProject(path: string): Promise<Project> {
  const workspaceRoot = await getRootFolder()

  if (mapOfProjectPaths.has(path)) {
    return mapOfProjectPaths.get(path) as Project
  }
  let tsConfigJsonName = 'tsconfig.json'

  if (path === './') {
    tsConfigJsonName = 'tsconfig.app.json'
  }
  const projectToAdd = new Project({
    tsConfigFilePath: `${workspaceRoot}/${path}/${tsConfigJsonName}`,
  })

  mapOfProjectPaths.set(path, projectToAdd)

  return projectToAdd
}
