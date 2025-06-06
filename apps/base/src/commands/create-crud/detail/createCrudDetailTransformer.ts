import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'

import type { CreateCrudDetailParams } from './createCrudDetail'
import { getCreateCrudDetailTransformerFile } from './createCrudDetail.files'

export async function createCrudDetailTransformer({
  entityName,
}: CreateCrudDetailParams) {
  const {
    name, path,
  } = getCreateCrudDetailTransformerFile(entityName)

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

  sourceFile.addImportDeclarations([
    {
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/detail/${entityName}Detail.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Detail`,
      ],
    },
    {
      isTypeOnly: true,
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/${entityName}Uuid.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Uuid`,
      ],
    },
  ])

  sourceFile.addClass({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(entityName)}DetailTransformer`,
    methods: [
      {
        isStatic: true,
        name: 'fromDto',
        parameters: [
          {
            name: 'dto',
            type: `any`,
          },
        ],
        returnType: `${CaseTransformer.toPascalCase(entityName)}Detail`,
        statements: [
          `
            return {
              uuid: dto.uuid as ${CaseTransformer.toPascalCase(entityName)}Uuid,
              // TODO Map other properties from dto to ${CaseTransformer.toPascalCase(entityName)}Detail
            }
          `,
        ],
      },
    ],
  })

  await sourceFile.save()
}
