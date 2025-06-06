import { createTemplate } from '#utils/template/createTemplate.utils.ts'

import {
  getCreateCrudUpdateDataProviderViewFile,
  getCreateCrudUpdateFormFile,
  getCreateCrudUpdateViewFile,
} from './createCrudUpdate.files'
import { getUpdateDataProviderViewFile } from './templates/updateDataProviderView.template'
import { getUpdateFormTemplate } from './templates/updateForm.template'
import { getUpdateViewTemplate } from './templates/updateView.template.ts'

export interface CreateCrudIndexViewParams {
  entityName: string
}

export function createCrudUpdateTemplates({
  entityName,
}: CreateCrudIndexViewParams) {
  const viewFile = getCreateCrudUpdateViewFile(entityName)
  const dataProviderFile = getCreateCrudUpdateDataProviderViewFile(entityName)
  const formFile = getCreateCrudUpdateFormFile(entityName)

  createTemplate({
    fileName: dataProviderFile.name,
    filePath: dataProviderFile.path,
    templateString: getUpdateDataProviderViewFile(entityName),
  })

  createTemplate({
    fileName: viewFile.name,
    filePath: viewFile.path,
    templateString: getUpdateViewTemplate(entityName),
  })

  createTemplate({
    fileName: formFile.name,
    filePath: formFile.path,
    templateString: getUpdateFormTemplate(entityName),
  })
}
