import fs from 'node:fs'

import { BASE_PATH } from '#constants/paths.constants.ts'
import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { getLogger } from '#utils/logger/logger.utils.ts'
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
  const logger = getLogger()
  const rootFolder = await getRootFolder()

  const filePath = `${rootFolder}/${path}/${name}`

  logger.info(`Getting project`)

  const project = await getTsProject(projectPath ?? BASE_PATH)

  logger.info(`Making path`)
  logger.info(`Path: ${path}`)

  fs.mkdirSync(`${rootFolder}/${path}`, {
    recursive: true,
  })

  logger.info(`Creating path: ${path}`)
  project.addDirectoryAtPathIfExists(path)
  logger.info(`Added directory`)

  logger.info(`Creating file: ${filePath}`)

  const sourceFile = project.createSourceFile(filePath, '')

  logger.info(`Created file: ${filePath}`)
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
