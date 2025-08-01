import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import type { CreateCrudIndexParams } from './createCrudIndex'
import {
  getCreateCrudIndexModelFile,
  getCreateCrudIndexTransformerFile,
} from './createCrudIndex.files'

export async function createCrudIndexTransformer({
  entityName,
}: CreateCrudIndexParams) {
  const {
    name, path,
  } = getCreateCrudIndexTransformerFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudIndexModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Index`,
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
      name: `${entityName.pascalCase}IndexTransformer`,
    })
    .addClassMethod({
      isStatic: true,
      name: 'fromDto',
      nameClass: `${entityName.pascalCase}IndexTransformer`,
      parameters: [
        {
          name: 'dto',
          type: `any`,
        },
      ],
      returnType: `${entityName.pascalCase}Index`,
      statements: [
        `return {
          uuid: dto.uuid as ${entityName.pascalCase}Uuid,
          // TODO Transform other properties from dto to ${entityName.pascalCase}Index
        }`,
      ],
    })
    .save()
}
