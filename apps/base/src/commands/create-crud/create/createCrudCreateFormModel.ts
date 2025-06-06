import { VariableDeclarationKind } from 'ts-morph'

import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'

import type { CreateCrudCreateParams } from './createCrudCreate'
import { getCreateCrudCreateFormModelFile } from './createCrudCreate.files'

export async function createCrudCreateFormModel({
  entityName,
}: CreateCrudCreateParams) {
  const {
    name, path,
  } = getCreateCrudCreateFormModelFile(entityName)

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
      `${CaseTransformer.toCamelCase(entityName)}UuidSchema`,
    ],
  })

  sourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${entityName}CreateFormSchema`,
        initializer: `z.object({
          uuid: ${CaseTransformer.toCamelCase(entityName)}UuidSchema,
        })`,
      },
    ],
    leadingTrivia: `// TODO Update z.object to the correct schema for ${entityName}CreateForm`,
  })

  sourceFile.addTypeAlias({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(entityName)}CreateForm`,
    type: `z.infer<typeof ${entityName}CreateFormSchema>`,
  })

  await sourceFile.save()
}
