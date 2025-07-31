import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudModuleIndexFile(entityName: EntityCasing) {
  return {
    name: `index.ts`,
    path: `src/modules/${entityName.kebabCase}`,
  }
}
