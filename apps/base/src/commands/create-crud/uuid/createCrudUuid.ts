import { VariableDeclarationKind } from 'ts-morph'

import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'

import { getCreateCrudUuidModelFile } from './createCrudUuid.files'

interface CreateCrudUuidOptions {
  entityName: string
}

export async function createCrudUuid({
  entityName,
}: CreateCrudUuidOptions) {
  const {
    name, path,
  } = getCreateCrudUuidModelFile(entityName)

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
    moduleSpecifier: 'zod',
    namedImports: [
      'z',
    ],
  })

  sourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${entityName}UuidSchema`,
        initializer: `z.string().uuid().brand('${entityName}Uuid')`,
      },
    ],
  })

  sourceFile.addTypeAlias({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(entityName)}Uuid`,
    type: `z.infer<typeof ${entityName}UuidSchema>`,
  })

  await sourceFile.save()
}
