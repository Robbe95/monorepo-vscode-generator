import { createCrudDeleteApiMutation } from './createCrudDeleteApiMutation'

export interface CreateCrudDeleteParams {
  entityName: string
}

export async function createCrudDelete({
  entityName,
}: CreateCrudDeleteParams) {
  await createCrudDeleteApiMutation({
    entityName,
  })
}
