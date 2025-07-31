import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudServiceFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}.service.ts`,
    path: `src/modules/${entityName.kebabCase}/api/services`,
  }
}
