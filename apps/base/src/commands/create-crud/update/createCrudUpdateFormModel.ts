import { VariableDeclarationKind } from 'ts-morph'

import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'

import type { CreateCrudUpdateParams } from './createCrudUpdate'
import { getCreateCrudUpdateFormModelFile } from './createCrudUpdate.files'

export async function createCrudUpdateFormModel({
  entityName,
}: CreateCrudUpdateParams) {
  const {
    name, path,
  } = getCreateCrudUpdateFormModelFile(entityName)

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
    moduleSpecifier: `zod`,
    namedImports: [
      `z`,
    ],
  })

  sourceFile.addImportDeclaration({
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/${entityName}Uuid.model.ts`,
    namedImports: [
      `${entityName}UuidSchema`,
    ],
  })

  sourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${entityName}UpdateFormSchema`,
        initializer: `z.object({
          uuid: ${entityName}UuidSchema,
        })`,
      },
    ],
    leadingTrivia: `// TODO Update z.object to the correct schema for ${entityName}UpdateForm`,
  })

  sourceFile.addTypeAlias({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(entityName)}UpdateForm`,
    type: `z.infer<typeof ${entityName}UpdateFormSchema>`,
  })

  sourceFile.saveSync()
}
