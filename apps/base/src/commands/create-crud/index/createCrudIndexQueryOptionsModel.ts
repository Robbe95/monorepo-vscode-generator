import { createCrudModuleAddExport } from '#commands/create-crud/module/createCrudModuleAddExport.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

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

  fileManipulator.addType({
    isExported: true,
    name: `${entityName.pascalCase}IndexQueryOptions`,
    comment: `// TODO Define the query options for ${entityName.pascalCase}Index.`,
    type: `any`,
  }).save()

  createCrudModuleAddExport({
    isTypeOnly: true,
    entityName,
    moduleSpecifier: toFileAlias(getCreateCrudIndexQueryOptionsModelFile(entityName)),
    namedExports: [
      `${entityName.pascalCase}IndexQueryOptions`,
    ],
  })
}
