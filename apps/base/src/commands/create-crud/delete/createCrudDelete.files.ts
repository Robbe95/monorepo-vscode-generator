import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudDeleteApiMutationFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Delete.mutation.ts`,
    path: `src/modules/${entityName.kebabCase}/api/mutations`,
  }
}
