import fs from 'node:fs'

import { BASE_PATH } from '#constants/paths.constants.ts'
import { getTsProject } from '#utils/ts-morph/getTsProject.utils.ts'

export async function createEmptyFile({
  name,
  projectPath,
  path,
}: {
  name: string
  projectPath?: string
  path: string
}) {
  const filePath = `${path}/${name}`

  const project = await getTsProject(projectPath ?? BASE_PATH)

  fs.mkdirSync(path, {
    recursive: true,
  })
  project.addDirectoryAtPathIfExists(path)

  const sourceFile = project.createSourceFile(filePath, '')

  sourceFile.saveSync()

  return sourceFile
}

export function hasFile({
  name, path,
}: {
  name: string
  path: string
}) {
  const filePath = `${path}/${name}`

  return fs.existsSync(filePath)
}
