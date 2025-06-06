import fs from 'node:fs'

import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { getLogger } from '#utils/logger/logger.utils.ts'

export interface CreateTemplateParams {
  fileName: string
  filePath: string
  templateString: string
}

export async function createTemplate({
  fileName,
  filePath,
  templateString,
}: CreateTemplateParams) {
  const logger = getLogger()
  const rootFolder = await getRootFolder()

  fs.mkdirSync(`${rootFolder}/${filePath}`, {
    recursive: true,
  })

  const fileFullPath = `${rootFolder}/${filePath}/${fileName}`

  if (fs.existsSync(fileFullPath)) {
    logger.info(`File already exists: ${fileFullPath}. Skipping creation.`)

    return
  }

  fs.writeFileSync(fileFullPath, templateString, {
    encoding: 'utf8',
  })
}
