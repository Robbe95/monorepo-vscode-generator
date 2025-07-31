import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { createTemplate } from '#utils/template/createTemplate.utils.ts'

import {
  getCreateCrudCreateFormFile,
  getCreateCrudCreateViewFile,
} from './createCrudCreate.files.ts'
import { getCreateCrudCreateFormTemplate } from './templates/createCrudCreateForm.template.ts'
import { getCreateCrudCreateViewTemplate } from './templates/createCrudCreateView.template.ts'

export interface CreateCrudIndexViewParams {
  entityName: EntityCasing
}

export async function createCrudCreateTemplates({
  entityName,
}: CreateCrudIndexViewParams) {
  const viewFile = getCreateCrudCreateViewFile(entityName)
  const formFile = getCreateCrudCreateFormFile(entityName)

  await createTemplate({
    fileName: viewFile.name,
    filePath: viewFile.path,
    templateString: await getCreateCrudCreateViewTemplate(entityName),
  })

  await createTemplate({
    fileName: formFile.name,
    filePath: formFile.path,
    templateString: await getCreateCrudCreateFormTemplate(entityName),
  })
}
