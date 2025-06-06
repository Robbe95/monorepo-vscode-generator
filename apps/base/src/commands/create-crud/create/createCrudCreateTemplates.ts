import { createTemplate } from '#utils/template/createTemplate.utils.ts'

import {
  getCreateCrudCreateFormFile,
  getCreateCrudCreateViewFile,
} from './createCrudCreate.files.ts'
import { getCreateCrudCreateFormTemplate } from './templates/createCrudCreateForm.template.ts'
import { getCreateCrudCreateViewTemplate } from './templates/createCrudCreateView.template.ts'

export interface CreateCrudIndexViewParams {
  entityName: string
}

export function createCrudCreateTemplates({
  entityName,
}: CreateCrudIndexViewParams) {
  const viewFile = getCreateCrudCreateViewFile(entityName)
  const formFile = getCreateCrudCreateFormFile(entityName)

  createTemplate({
    fileName: viewFile.name,
    filePath: viewFile.path,
    templateString: getCreateCrudCreateViewTemplate(entityName),
  })

  createTemplate({
    fileName: formFile.name,
    filePath: formFile.path,
    templateString: getCreateCrudCreateFormTemplate(entityName),
  })
}
