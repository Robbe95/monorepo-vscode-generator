import { BASE_PATH } from '#constants/paths.constants.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'

import { getCreateCrudModuleIndexFile } from './createCrudModule.files'

export interface CreateCrudModuleAddExportParams {
  isTypeOnly?: boolean
  entityName: EntityCasing
  moduleSpecifier: string
  namedExports: string[]
}

export async function createCrudModuleAddExport({
  isTypeOnly,
  entityName,
  moduleSpecifier,
  namedExports,
}: CreateCrudModuleAddExportParams) {
  const {
    name, path,
  } = getCreateCrudModuleIndexFile(entityName)
  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addExport({
      isTypeOnly,
      moduleSpecifier,
      namedExports,
    })
    .save()
}
