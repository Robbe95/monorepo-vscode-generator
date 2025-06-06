import { createCrudUpdateApiMutation } from './createCrudUpdateApiMutation'
import { createCrudUpdateFormModel } from './createCrudUpdateFormModel'
import { createCrudUpdateTemplates } from './createCrudUpdateTemplates'
import { createCrudUpdateTransformer } from './createCrudUpdateTransformer'

export interface CreateCrudUpdateParams {
  entityName: string
}

export async function createCrudUpdate({
  entityName,
}: CreateCrudUpdateParams) {
  await createCrudUpdateFormModel({
    entityName,
  })
  await createCrudUpdateTransformer({
    entityName,
  })
  await createCrudUpdateApiMutation({
    entityName,
  })
  await createCrudUpdateTemplates({
    entityName,
  })
}
