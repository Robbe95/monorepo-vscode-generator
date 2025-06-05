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
  // The index view is typically a list or table view of the entities.
  // It may include features like sorting, filtering, and pagination.
  // This function can be extended to generate the necessary components
  // and logic for displaying the index view of the CRUD entity.

  // Placeholder for future implementation
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
