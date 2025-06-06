import { createCrudIndexApiQuery } from './createCrudIndexApiQuery'
import { createCrudIndexModel } from './createCrudIndexModel'
import { createCrudIndexQueryOptionsModel } from './createCrudIndexQueryOptionsModel'
import { createCrudIndexTransformer } from './createCrudIndexTransformer'
import { createCrudIndexView } from './createCrudIndexView'

export interface CreateCrudIndexParams {
  entityName: string
}

export async function createCrudIndex({
  entityName,
}: CreateCrudIndexParams) {
  await createCrudIndexModel({
    entityName,
  })
  await createCrudIndexTransformer({
    entityName,
  })
  await createCrudIndexQueryOptionsModel({
    entityName,
  })
  await createCrudIndexApiQuery({
    entityName,
  })
  await createCrudIndexView({
    entityName,
  })
}
