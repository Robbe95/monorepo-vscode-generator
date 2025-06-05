import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'

import type { CreateCrudIndexParams } from './createCrudIndex'
import { getCreateCrudIndexTransformerFile } from './createCrudIndex.files'

export async function createCrudIndexTransformer({
  entityName,
}: CreateCrudIndexParams) {
  const {
    name, path,
  } = getCreateCrudIndexTransformerFile(entityName)

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
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/index/${entityName}Index.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}Index`,
    ],
  })

  sourceFile.addStatements(`// TODO ${CaseTransformer.toPascalCase(entityName)}IndexTransformer is generated. Update it with your properties.`)

  sourceFile.addClass({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(entityName)}IndexTransformer`,
    methods: [
      {
        isStatic: true,
        name: 'fromDto',
        leadingTrivia: `// TODO Update the type of dto to the correct DTO type for ${CaseTransformer.toPascalCase(entityName)}Index`,
        parameters: [
          {
            name: 'dto',
            type: `any`,
          },
        ],
        returnType: `${CaseTransformer.toPascalCase(entityName)}Index`,
        statements: [
          `
            return {
              uuid: dto.uuid as ${CaseTransformer.toPascalCase(entityName)}Uuid,
            }
          `,
        ],
      },
    ],
  })

  await sourceFile.save()
}
