import { createTemplate } from '#utils/template/createTemplate.utils.ts'

import {
  getCreateCrudIndexViewFile,
  getCreateCrudIndexViewTableFile,
} from './createCrudIndex.files'
import { getIndexTableTemplate } from './templates/indexTable.template'
import { getIndexViewTemplate } from './templates/indexView.template'

export interface CreateCrudIndexViewParams {
  entityName: string
}

export function createCrudIndexView({
  entityName,
}: CreateCrudIndexViewParams) {
  const viewFile = getCreateCrudIndexViewFile(entityName)
  const tableFile = getCreateCrudIndexViewTableFile(entityName)

  createTemplate({
    fileName: viewFile.name,
    filePath: viewFile.path,
    templateString: getIndexViewTemplate(entityName),
  })

  createTemplate({
    fileName: tableFile.name,
    filePath: tableFile.path,
    templateString: getIndexTableTemplate(entityName),
  })
}
