import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import type { CreateCrudDetailParams } from './createCrudDetail'
import { getCreateCrudDetailModelFile } from './createCrudDetail.files'

export async function createCrudDetailModel({
  entityName,
}: CreateCrudDetailParams) {
  const {
    name, path,
  } = getCreateCrudDetailModelFile(entityName)

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
      statement: `// TODO ${entityName}Detail is generated. Update it with your properties.`,
    })
    .addInterface({
      isExported: true,
      name: `${entityName.pascalCase}Detail`,
      properties: [
        {
          name: 'uuid',
          type: `${entityName.pascalCase}Uuid`,
        },
      ],
    })
    .save()
}
