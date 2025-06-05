import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'

import type { CreateCrudDetailParams } from './createCrudDetail'
import { getCreateCrudDetailModelFile } from './createCrudDetail.files'

export async function createCrudDetailModel({
  entityName,
}: CreateCrudDetailParams) {
  const {
    name, path,
  } = getCreateCrudDetailModelFile(entityName)

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

  sourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/${entityName}Uuid.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}Uuid`,
    ],
  })

  sourceFile.addStatements(`// TODO ${entityName}Detail is generated. Update it with your properties.`)

  sourceFile.addInterface({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(entityName)}Detail`,
    properties: [
      {
        name: 'uuid',
        type: `${CaseTransformer.toPascalCase(entityName)}Uuid`,
      },
    ],
  })

  await sourceFile.save()
}
