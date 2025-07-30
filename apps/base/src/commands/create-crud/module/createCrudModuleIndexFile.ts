import { BASE_PATH } from '#constants/paths.constants.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'

import type { CreateCrudModuleParams } from './createCrudModule'
import { getCreateCrudModuleIndexFile } from './createCrudModule.files'

export async function createCrudModuleIndexFile({
  entityName,
}: CreateCrudModuleParams) {
  const {
    name, path,
  } = getCreateCrudModuleIndexFile(entityName)
  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator.save()
}
