import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import type { CreateCrudDetailParams } from './createCrudDetail'
import {
  getCreateCrudDetailModelFile,
  getCreateCrudDetailTransformerFile,
} from './createCrudDetail.files'

export async function createCrudDetailTransformer({
  entityName,
}: CreateCrudDetailParams) {
  const {
    name, path,
  } = getCreateCrudDetailTransformerFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudDetailModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Detail`,
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudUuidModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Uuid`,
      ],
    })
    .addClass({
      isExported: true,
      name: `${entityName.pascalCase}DetailTransformer`,
    })
    .addClassMethod({
      isStatic: true,
      name: 'fromDto',
      nameClass: `${entityName.pascalCase}DetailTransformer`,
      parameters: [
        {
          name: 'dto',
          type: 'any',
        },
      ],
      returnType: `${entityName.pascalCase}Detail`,
      statements: [
        `return {
          uuid: dto.uuid as ${entityName.pascalCase}Uuid,
          // TODO Map other properties from dto to ${entityName.pascalCase}Detail
        }`,
      ],
    })
    .save()
}
