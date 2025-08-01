import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudUuidModelFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Uuid.model.ts`,
    path: `src/modules/${entityName.kebabCase}/models/${entityName.kebabCase}`,
  }
}
