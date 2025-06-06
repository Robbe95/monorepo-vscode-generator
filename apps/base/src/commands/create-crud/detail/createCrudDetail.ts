import { createCrudDetailApiQuery } from './createCrudDetailApiQuery'
import { createCrudDetailModel } from './createCrudDetailModel'
import { createCrudDetailQueryModel } from './createCrudDetailQueryOptionsModel'
import { createCrudDetailTransformer } from './createCrudDetailTransformer'
import { createCrudDetailView } from './createCrudDetailView'

export interface CreateCrudDetailParams {
  entityName: string
}

export async function createCrudDetail({
  entityName,
}: CreateCrudDetailParams) {
  await createCrudDetailModel({
    entityName,
  })
  await createCrudDetailTransformer({
    entityName,
  })
  await createCrudDetailQueryModel({
    entityName,
  })
  await createCrudDetailApiQuery({
    entityName,
  })
  createCrudDetailView({
    entityName,
  })
}
