import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudRoutesFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}.routes.ts`,
    path: `src/modules/${entityName.kebabCase}/routes`,
  }
}
