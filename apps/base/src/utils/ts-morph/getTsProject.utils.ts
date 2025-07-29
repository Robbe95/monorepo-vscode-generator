import { Project } from 'ts-morph'

import { getConfig } from '#config/getConfig.ts'
import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'

const mapOfProjectPaths = new Map<string, Project>()

export async function getTsProject(path: string): Promise<Project> {
  const workspaceRoot = await getRootFolder()
  const config = await getConfig()

  if (mapOfProjectPaths.has(path)) {
    return mapOfProjectPaths.get(path) as Project
  }
  const tsConfigJsonName = config.tsConfigFileName

  const projectToAdd = new Project({
    tsConfigFilePath: `${workspaceRoot}/${path}/${tsConfigJsonName}`,
  })

  mapOfProjectPaths.set(path, projectToAdd)

  return projectToAdd
}
