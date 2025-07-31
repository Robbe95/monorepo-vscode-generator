import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

import { createCrudDeleteApiMutation } from './createCrudDeleteApiMutation'

export interface CreateCrudDeleteParams {
  entityName: EntityCasing
}

export async function createCrudDelete({
  entityName,
}: CreateCrudDeleteParams) {
  await createCrudDeleteApiMutation({
    entityName,
  })
}
