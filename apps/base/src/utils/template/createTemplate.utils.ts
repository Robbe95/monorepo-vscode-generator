import fs from 'node:fs'

import { getLogger } from '#utils/logger/logger.utils.ts'

export interface CreateTemplateParams {
  fileName: string
  filePath: string
  templateString: string
}

export function createTemplate({
  fileName,
  filePath,
  templateString,
}: CreateTemplateParams): void {
  const logger = getLogger()

  // make a file in the filePath with the fileName and templateString if it does not exist
  fs.mkdirSync(filePath, {
    recursive: true,
  })

  const fileFullPath = `${filePath}/${fileName}`

  if (fs.existsSync(fileFullPath)) {
    logger.info(`File already exists: ${fileFullPath}. Skipping creation.`)

    return
  }

  fs.writeFileSync(fileFullPath, templateString, {
    encoding: 'utf8',
  })
}
