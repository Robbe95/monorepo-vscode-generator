import {
  readFileSync,
  writeFileSync,
} from 'node:fs'

import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { getLogger } from '#utils/logger/logger.utils.ts'

export async function addTranslation({
  key, value,
}: {
  key: string
  value: string
}): Promise<void> {
  const rootFolder = await getRootFolder()
  const enTranslationFile = `${rootFolder}/src/locales/en-US.json`
  const logger = getLogger()
  // there is a json in there, add the key and value to the json file
  const translations = JSON.parse(readFileSync(enTranslationFile, 'utf8'))

  if (translations[key]) {
    logger.info(`Translation key "${key}" already exists. Skipping addition.`)

    return translations
  }
  else {
    translations[key] = value
    writeFileSync(enTranslationFile, JSON.stringify(translations, null, 2), 'utf8')
    logger.info(`Added translation: ${key} = ${value}`)
  }
}
