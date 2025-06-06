import { createCrudCreateApiMutation } from './createCrudCreateApiMutation'
import { createCrudCreateFormModel } from './createCrudCreateFormModel'
import { createCrudCreateTemplates } from './createCrudCreateTemplates'
import { createCrudCreateTransformer } from './createCrudCreateTransformer'

export interface CreateCrudCreateParams {
  entityName: string
}

export async function createCrudCreate({
  entityName,
}: CreateCrudCreateParams) {
  await createCrudCreateFormModel({
    entityName,
  })
  await createCrudCreateTransformer({
    entityName,
  })
  await createCrudCreateApiMutation({
    entityName,
  })
  createCrudCreateTemplates({
    entityName,
  })
}
