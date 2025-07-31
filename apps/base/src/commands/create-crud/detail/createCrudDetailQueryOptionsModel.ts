import { BASE_PATH } from '#constants/paths.constants.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'

import type { CreateCrudDetailParams } from './createCrudDetail'
import { getCreateCrudDetailQueryOptionsModelFile } from './createCrudDetail.files'

export async function createCrudDetailQueryModel({
  entityName,
}: CreateCrudDetailParams) {
  const {
    name, path,
  } = getCreateCrudDetailQueryOptionsModelFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addType({
      isExported: true,
      name: `${entityName.pascalCase}DetailQueryOptions`,
      comment: `// TODO Define the query options for ${entityName.pascalCase}Detail.`,
      type: 'any',
    })
    .save()
}
