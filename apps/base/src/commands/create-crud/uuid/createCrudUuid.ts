import { createCrudModuleAddExport } from '#commands/create-crud/module/createCrudModuleAddExport.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import { getCreateCrudUuidModelFile } from './createCrudUuid.files'

interface CreateCrudUuidOptions {
  entityName: EntityCasing
}

export async function createCrudUuid({
  entityName,
}: CreateCrudUuidOptions) {
  const {
    name, path,
  } = getCreateCrudUuidModelFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addImport({
      moduleSpecifier: 'zod',
      namedImports: [
        'z',
      ],
    })
    .addVariable({
      isExported: true,
      name: `${entityName.camelCase}UuidSchema`,
      initializer: `z.string().uuid().brand('${entityName.camelCase}Uuid')`,
    })
    .addType({
      isExported: true,
      name: `${entityName.pascalCase}Uuid`,
      type: `z.infer<typeof ${entityName.camelCase}UuidSchema>`,
    })
    .save()

  createCrudModuleAddExport({
    isTypeOnly: true,
    entityName,
    moduleSpecifier: toFileAlias(getCreateCrudUuidModelFile(entityName)),
    namedExports: [
      `${entityName.pascalCase}Uuid`,
    ],
  })
}
