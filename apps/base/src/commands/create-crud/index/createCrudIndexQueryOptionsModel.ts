import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'

import type { CreateCrudIndexParams } from './createCrudIndex'
import { getCreateCrudIndexQueryOptionsModelFile } from './createCrudIndex.files'

export async function createCrudIndexQueryOptionsModel({
  entityName,
}: CreateCrudIndexParams) {
  const {
    name, path,
  } = getCreateCrudIndexQueryOptionsModelFile(entityName)

  const sourceFileResponse = await tryCatch(createEmptyFile({
    name,
    projectPath: BASE_PATH,
    path,
  }))

  if (sourceFileResponse.error) {
    await skipFile({
      name,
      path,
    })

    return
  }

  const sourceFile = sourceFileResponse.data

  sourceFile.addTypeAlias({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(entityName)}IndexQueryOptions`,
    leadingTrivia: `// TODO Define the query options for ${CaseTransformer.toPascalCase(entityName)}Index.`,
    type: `any`,
  })

  await sourceFile.save()
}
