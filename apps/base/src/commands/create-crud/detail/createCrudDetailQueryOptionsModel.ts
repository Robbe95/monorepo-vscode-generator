import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'

import type { CreateCrudDetailParams } from './createCrudDetail'
import { getCreateCrudDetailQueryOptionsModelFile } from './createCrudDetail.files'

export async function createCrudDetailQueryModel({
  entityName,
}: CreateCrudDetailParams) {
  const {
    name, path,
  } = getCreateCrudDetailQueryOptionsModelFile(entityName)

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
    name: `${CaseTransformer.toPascalCase(entityName)}DetailQueryOptions`,
    leadingTrivia: `// TODO Define the query options for ${CaseTransformer.toPascalCase(entityName)}Detail.`,
    type: `any`,
  })

  await sourceFile.save()
}
