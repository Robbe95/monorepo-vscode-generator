import { BASE_PATH } from '#constants/paths.constants.ts'
import { allCases } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'

import type { CreateCrudIndexParams } from './createCrudIndex'
import { getCreateCrudIndexQueryOptionsModelFile } from './createCrudIndex.files'

export async function createCrudIndexQueryOptionsModel({
  entityName,
}: CreateCrudIndexParams) {
  const {
    name, path,
  } = getCreateCrudIndexQueryOptionsModelFile(entityName)
  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  const entityCasing = allCases(entityName)

  fileManipulator.addType({
    isExported: true,
    name: `${entityCasing.pascalCase}IndexQueryOptions`,
    comment: `// TODO Define the query options for ${entityCasing.pascalCase}Index.`,
    type: `any`,
  }).save()
}
