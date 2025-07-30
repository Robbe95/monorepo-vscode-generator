import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { allCases } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import type { CreateCrudIndexParams } from './createCrudIndex'
import { getCreateCrudIndexModelFile } from './createCrudIndex.files'

export async function createCrudIndexModel({
  entityName,
}: CreateCrudIndexParams) {
  const {
    name, path,
  } = getCreateCrudIndexModelFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  const entityCasing = allCases(entityName)

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudUuidModelFile(entityName)),
      namedImports: [
        `${entityCasing.pascalCase}Uuid`,
      ],
    })
    .addStatement({
      statement: `// TODO ${entityCasing.camelCase}Index is generated. Update it with your properties.`,
    })
    .addInterface({
      isExported: true,
      name: `${entityCasing.pascalCase}Index`,
      properties: [
        {
          name: 'uuid',
          type: `${entityCasing.pascalCase}Uuid`,
        },
      ],
    })
    .save()
}
