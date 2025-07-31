import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
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

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudUuidModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Uuid`,
      ],
    })
    .addStatement({
      statement: `// TODO ${entityName.camelCase}Index is generated. Update it with your properties.`,
    })
    .addInterface({
      isExported: true,
      name: `${entityName.pascalCase}Index`,
      properties: [
        {
          name: 'uuid',
          type: `${entityName.pascalCase}Uuid`,
        },
      ],
    })
    .save()
}
