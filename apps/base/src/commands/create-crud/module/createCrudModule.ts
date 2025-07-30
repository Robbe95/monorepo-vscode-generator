import { createCrudModuleIndexFile } from './createCrudModuleIndexFile'

export interface CreateCrudModuleParams {
  entityName: string
}

export async function createCrudModule({
  entityName,
}: CreateCrudModuleParams) {
  await createCrudModuleIndexFile({

    entityName,
  })
}
