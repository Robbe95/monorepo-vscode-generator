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
    skipFile({
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

  sourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${entityName}CreateFormModelSchema`,
        initializer: `z.object({})`,
      },
    ],
    leadingTrivia: `// TODO Update z.object to the correct schema for ${entityName}CreateFormModel`,
  })

  sourceFile.addTypeAlias({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(entityName)}CreateFormModel`,
    type: `z.infer<typeof ${entityName}CreateFormModelSchema>`,
  })

  await sourceFile.save()
}
