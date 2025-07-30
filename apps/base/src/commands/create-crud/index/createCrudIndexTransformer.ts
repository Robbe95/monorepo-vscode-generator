import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
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
      moduleSpecifier: toFileAlias(getCreateCrudIndexModelFile(entityName)),
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Index`,
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudUuidModelFile(entityName)),
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Uuid`,
      ],
    })
    .addClass({
      isExported: true,
      name: `${CaseTransformer.toPascalCase(entityName)}IndexTransformer`,
    })
    .addClassMethod({
      isStatic: true,
      name: 'fromDto',
      nameClass: `${CaseTransformer.toPascalCase(entityName)}IndexTransformer`,
      parameters: [
        {
          name: 'dto',
          type: `any`,
        },
      ],
      returnType: `${CaseTransformer.toPascalCase(entityName)}Index`,
      statements: [
        `return {
          uuid: dto.uuid as ${CaseTransformer.toPascalCase(entityName)}Uuid,
          // TODO Transform other properties from dto to ${CaseTransformer.toPascalCase(entityName)}Index
        }`,
      ],
    })
    .save()
}
