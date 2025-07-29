import {
  readFileSync,
  writeFileSync,
} from 'node:fs'

import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { getInputString } from '#utils/input/getInputString.utils.ts'
import { getLogger } from '#utils/logger/logger.utils.ts'

import type { ConfigFile } from './configShape'
import {
  CONFIG_FILE_PATH,
  DEFAULT_LANGUAGE_FILE_LOCATION,
  DEFAULT_QUERY_FILE_KEY_LOCATION,
  DEFAULT_ROUTER_FILE_LOCATION,
  DEFAULT_TS_CONFIG_FILE_NAME,
} from './configShape'
import { createInitialConfig } from './setupConfig'

export async function getConfig(): Promise<ConfigFile> {
  const rootFolder = await getRootFolder()
  let configObject: Record<string, string>

  // there is a json in there, add the key and value to the json file
  try {
    configObject = JSON.parse(readFileSync(`${rootFolder}/${CONFIG_FILE_PATH}`, 'utf8')) as Record<string, string>
  }
  catch {
    configObject = await createInitialConfig()
  }

  const config: ConfigFile = {
    languageFileLocation: await getLanguageFileLocation(configObject),
    queryFileKeyLocation: await getQueryFileKeyLocation(configObject),
    routerFileLocation: await getRouterFileLocation(configObject),
    tsConfigFileName: await getTsConfigFileName(configObject),
  }

  return config
}

function getValue(
  configObject: Record<string, string>,
  key: keyof ConfigFile,
): string | null {
  try {
    const value = configObject[key]

    if (!value) {
      return null
    }

    return value.replace(/['"]/g, '') // Remove quotes
  }
  catch {
    return null
  }
}

async function getLanguageFileLocation(configObject: Record<string, string>): Promise<string> {
  const existingLanguageFileLocation = getValue(configObject, 'languageFileLocation')

  if (existingLanguageFileLocation) {
    return existingLanguageFileLocation
  }
  const languageFileLocation = await getInputString({
    title: 'Language File Location',
    canBeEmpty: true,
    prompt: `Where is the English language file located? (default: '${DEFAULT_LANGUAGE_FILE_LOCATION}')`,
  })

  configObject.languageFileLocation = !languageFileLocation || languageFileLocation === '' ? DEFAULT_LANGUAGE_FILE_LOCATION : languageFileLocation
  await writeToConfigFile(configObject)

  return configObject.languageFileLocation
}

async function getQueryFileKeyLocation(configObject: Record<string, string>): Promise<string> {
  const existingQueryFileKeyLocation = getValue(configObject, 'queryFileKeyLocation')

  if (existingQueryFileKeyLocation) {
    return existingQueryFileKeyLocation
  }
  const queryFileKeyLocation = await getInputString({
    title: 'Query key file location',
    canBeEmpty: true,
    prompt: `Where is the Query key file located? (default: '${DEFAULT_QUERY_FILE_KEY_LOCATION}')`,
  })

  configObject.queryFileKeyLocation = !queryFileKeyLocation || queryFileKeyLocation === '' ? DEFAULT_QUERY_FILE_KEY_LOCATION : queryFileKeyLocation
  await writeToConfigFile(configObject)

  return configObject.queryFileKeyLocation
}

async function getRouterFileLocation(configObject: Record<string, string>): Promise<string> {
  const existingRouterFileLocation = getValue(configObject, 'routerFileLocation')

  if (existingRouterFileLocation) {
    return existingRouterFileLocation
  }
  const routerFileLocation = await getInputString({
    title: 'Router file location',
    canBeEmpty: true,
    prompt: `Where is the Router file located? (default: '${DEFAULT_ROUTER_FILE_LOCATION}')`,
  })

  configObject.routerFileLocation = !routerFileLocation || routerFileLocation === '' ? DEFAULT_ROUTER_FILE_LOCATION : routerFileLocation
  await getLogger().info(`Router file location set to: ${configObject.routerFileLocation}`)
  await writeToConfigFile(configObject)

  return configObject.routerFileLocation
}

async function getTsConfigFileName(configObject: Record<string, string>): Promise<string> {
  const existingTsConfigFileName = getValue(configObject, 'tsConfigFileName')

  if (existingTsConfigFileName) {
    return existingTsConfigFileName
  }
  const tsConfigFileName = await getInputString({
    title: 'TSConfig file name',
    canBeEmpty: true,
    prompt: `Where is the TSConfig file name? (default: '${DEFAULT_TS_CONFIG_FILE_NAME}')`,
  })

  configObject.tsConfigFileName = !tsConfigFileName || tsConfigFileName === '' ? DEFAULT_TS_CONFIG_FILE_NAME : tsConfigFileName
  await getLogger().info(`TSConfig file name set to: ${configObject.tsConfigFileName}`)
  await writeToConfigFile(configObject)

  return configObject.tsConfigFileName
}

async function writeToConfigFile(
  configObject: Record<string, string>,
) {
  const rootFolder = await getRootFolder()
  const configFilePath = `${rootFolder}/${CONFIG_FILE_PATH}`

  writeFileSync(configFilePath, JSON.stringify(configObject, null, 2), 'utf8')
}
