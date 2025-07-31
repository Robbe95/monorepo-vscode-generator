import { BASE_PATH } from '#constants/paths.constants.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'

import { getCreateCrudServiceFile } from './createCrudService.files'

export interface CreateCrudServiceParams {
  entityName: EntityCasing
}

export async function createCrudService({
  entityName,
}: CreateCrudServiceParams) {
  const {
    name, path,
  } = getCreateCrudServiceFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addClass({
      isExported: true,
      name: `${entityName.pascalCase}Service`,
    })
    .save()
}
