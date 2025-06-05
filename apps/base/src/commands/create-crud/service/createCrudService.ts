import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'

import { getCreateCrudServiceFile } from './createCrudService.files'

export interface CreateCrudServiceParams {
  entityName: string
}

export async function createCrudService({
  entityName,
}: CreateCrudServiceParams) {
  const {
    name, path,
  } = getCreateCrudServiceFile(entityName)

  const sourceFileResponse = await tryCatch(createEmptyFile({
    name,
    projectPath: BASE_PATH,
    path,
  }))

  if (sourceFileResponse.error) {
    skipFile({
      name,
      path,
    })

    return
  }

  const sourceFile = sourceFileResponse.data

  sourceFile.addClass({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(entityName)}Service`,
  })

  sourceFile.saveSync()
}
