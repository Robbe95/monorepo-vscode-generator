import {
  readFileSync,
  writeFileSync,
} from 'node:fs'

import { getConfig } from '#config/getConfig.ts'
import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'

export async function addTranslation({
  key, value,
}: {
  key: string
  value: string
}): Promise<void> {
  const rootFolder = await getRootFolder()
  const config = await getConfig()

  const enTranslationFile = `${rootFolder}/${config.languageFileLocation}`
  const translations = JSON.parse(readFileSync(enTranslationFile, 'utf8'))

  if (translations[key]) {
    return translations
  }
  else {
    translations[key] = value
    writeFileSync(enTranslationFile, JSON.stringify(translations, null, 2), 'utf8')
  }
}
