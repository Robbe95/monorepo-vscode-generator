import fs from 'node:fs'

import { getTsProject } from '#utils/ts-morph/getTsProject.utils.ts'

export function createEmptyFile({
  name,
  projectPath,
  path,
}: {
  name: string
  projectPath: string
  path: string
}) {
  const filePath = `${path}/${name}`

  const project = getTsProject(projectPath)

  fs.mkdirSync(path, {
    recursive: true,
  })
  project.addDirectoryAtPathIfExists(path)

  const sourceFile = project.createSourceFile(filePath, '')

  sourceFile.saveSync()

  return filePath
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
