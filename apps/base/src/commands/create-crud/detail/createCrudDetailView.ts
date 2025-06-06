import { createTemplate } from '#utils/template/createTemplate.utils.ts'

import {
  getCreateCrudDetailDataProviderFile,
  getCreateCrudDetailViewFile,
} from './createCrudDetail.files'
import { getDetailDataProviderTemplate } from './templates/detailDataProvider.template'
import { getDetailViewTemplate } from './templates/detailView.template'

export interface CreateCrudDetailViewParams {
  entityName: string
}

export function createCrudDetailView({
  entityName,
}: CreateCrudDetailViewParams) {
  const viewFile = getCreateCrudDetailViewFile(entityName)
  const dataProviderFile = getCreateCrudDetailDataProviderFile(entityName)

  createTemplate({
    fileName: viewFile.name,
    filePath: viewFile.path,
    templateString: getDetailViewTemplate({
      entityName,
    }),
  })

  createTemplate({
    fileName: dataProviderFile.name,
    filePath: dataProviderFile.path,
    templateString: getDetailDataProviderTemplate({
      entityName,
    }),
  })
}
