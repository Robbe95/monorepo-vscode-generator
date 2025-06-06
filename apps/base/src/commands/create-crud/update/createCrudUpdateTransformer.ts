import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'

import type { CreateCrudUpdateParams } from './createCrudUpdate'
import { getCreateCrudUpdateTransformerFile } from './createCrudUpdate.files'

export async function createCrudUpdateTransformer({
  entityName,
}: CreateCrudUpdateParams) {
  const {
    name, path,
  } = getCreateCrudUpdateTransformerFile(entityName)

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

  sourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/update/${entityName}UpdateForm.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}UpdateForm`,
    ],
  })

  sourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/detail/${entityName}Detail.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}Detail`,
    ],
  })

  sourceFile.addClass({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(entityName)}UpdateTransformer`,
    methods: [
      {
        isStatic: true,
        name: 'toDto',
        leadingTrivia: `// TODO Update the type of form to the correct form type for ${CaseTransformer.toPascalCase(entityName)}UpdateTransformer`,
        parameters: [
          {
            name: 'form',
            type: `${CaseTransformer.toPascalCase(entityName)}UpdateForm`,
          },
        ],
        returnType: `any`, // Update this to the correct DTO type
        statements: [
          `return { /* TODO Map form properties to DTO properties */ }`,
        ],
      },
      {
        isStatic: true,
        name: 'toForm',
        parameters: [
          {
            name: `${CaseTransformer.toCamelCase(entityName)}`,
            type: `${CaseTransformer.toPascalCase(entityName)}Detail`, // Update this to the correct DTO type
          },
        ],
        returnType: `${CaseTransformer.toPascalCase(entityName)}UpdateForm`,
        statements: [
          `return { 
            uuid: ${CaseTransformer.toCamelCase(entityName)}.uuid,
            /* TODO Map dto properties to form properties */
           }`,
        ],
      },
    ],
  })

  await sourceFile.save()
}
