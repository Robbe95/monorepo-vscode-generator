import { VariableDeclarationKind } from 'ts-morph'

import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'

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

  const sourceFile = await createEmptyFile({
    name,
    path,
  })

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
