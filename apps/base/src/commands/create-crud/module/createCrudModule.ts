import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

import { createCrudModuleIndexFile } from './createCrudModuleIndexFile'

export interface CreateCrudModuleParams {
  entityName: EntityCasing
}

export async function createCrudModule({
  entityName,
}: CreateCrudModuleParams) {
  await createCrudModuleIndexFile({
    entityName,
  })
}
