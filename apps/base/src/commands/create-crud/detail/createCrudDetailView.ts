import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { createTemplate } from '#utils/template/createTemplate.utils.ts'

import {
  getCreateCrudDetailDataProviderFile,
  getCreateCrudDetailViewFile,
} from './createCrudDetail.files'
import { getDetailDataProviderTemplate } from './templates/detailDataProvider.template'
import { getDetailViewTemplate } from './templates/detailView.template'

export interface CreateCrudDetailViewParams {
  entityName: EntityCasing
}

export async function createCrudDetailView({
  entityName,
}: CreateCrudDetailViewParams) {
  const viewFile = getCreateCrudDetailViewFile(entityName)
  const dataProviderFile = getCreateCrudDetailDataProviderFile(entityName)

  await createTemplate({
    fileName: viewFile.name,
    filePath: viewFile.path,
    templateString: await getDetailViewTemplate({
      entityName,
    }),
  })

  await createTemplate({
    fileName: dataProviderFile.name,
    filePath: dataProviderFile.path,
    templateString: getDetailDataProviderTemplate({
      entityName,
    }),
  })
}
