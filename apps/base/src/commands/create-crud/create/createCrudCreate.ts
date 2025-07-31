import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

import { createCrudCreateApiMutation } from './createCrudCreateApiMutation'
import { createCrudCreateFormModel } from './createCrudCreateFormModel'
import { createCrudCreateTemplates } from './createCrudCreateTemplates'
import { createCrudCreateTransformer } from './createCrudCreateTransformer'

export interface CreateCrudCreateParams {
  entityName: EntityCasing
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
  await createCrudCreateTemplates({
    entityName,
  })
}
