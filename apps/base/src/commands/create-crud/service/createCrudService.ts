import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'

import { getCreateCrudServiceFile } from './createCrudService.files'

export interface CreateCrudServiceParams {
  entityName: string
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
      name: `${CaseTransformer.toPascalCase(entityName)}Service`,
    })
    .save()
}
