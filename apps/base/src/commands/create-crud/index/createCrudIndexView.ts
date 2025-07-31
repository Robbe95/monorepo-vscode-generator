import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { createTemplate } from '#utils/template/createTemplate.utils.ts'

import {
  getCreateCrudIndexViewFile,
  getCreateCrudIndexViewTableFile,
} from './createCrudIndex.files'
import { getIndexTableTemplate } from './templates/indexTable.template'
import { getIndexViewTemplate } from './templates/indexView.template'

export interface CreateCrudIndexViewParams {
  entityName: EntityCasing
}

export async function createCrudIndexView({
  entityName,
}: CreateCrudIndexViewParams) {
  const viewFile = getCreateCrudIndexViewFile(entityName)
  const tableFile = getCreateCrudIndexViewTableFile(entityName)

  await createTemplate({
    fileName: viewFile.name,
    filePath: viewFile.path,
    templateString: await getIndexViewTemplate(entityName),
  })

  await createTemplate({
    fileName: tableFile.name,
    filePath: tableFile.path,
    templateString: await getIndexTableTemplate(entityName),
  })
}
