// what do i need to config?

import { writeFileSync } from 'node:fs'

import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'

import { CONFIG_FILE_PATH } from './configShape'

export async function createInitialConfig() {
  const configJson = {}

  const rootFolder = await getRootFolder()
  const configFilePath = `${rootFolder}/${CONFIG_FILE_PATH}`

  writeFileSync(configFilePath, `{}`, 'utf8')

  return configJson
}
