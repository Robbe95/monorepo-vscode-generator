import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'

import type { CreateCrudCreateParams } from './createCrudCreate'
import { getCreateCrudCreateTransformerFile } from './createCrudCreate.files'

export async function createCrudCreateTransformer({
  entityName,
}: CreateCrudCreateParams) {
  const {
    name, path,
  } = getCreateCrudCreateTransformerFile(entityName)

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
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/create/${entityName}CreateForm.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}CreateForm`,
    ],
  })

  sourceFile.addClass({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(entityName)}CreateTransformer`,
    methods: [
      {
        isStatic: true,
        name: 'toDto',
        parameters: [
          {
            name: 'form',
            type: `${CaseTransformer.toPascalCase(entityName)}CreateForm`,
          },
        ],
        returnType: `any`, // Update this to the correct DTO type
        statements: [
          `return { /* TODO Map form properties to DTO properties */ }`,
        ],
      },
    ],
  })

  await sourceFile.save()
}
