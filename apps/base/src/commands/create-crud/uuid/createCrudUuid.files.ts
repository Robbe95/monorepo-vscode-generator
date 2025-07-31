import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudUuidModelFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Uuid.model.ts`,
    path: `src/models/${entityName.kebabCase}`,
  }
}
