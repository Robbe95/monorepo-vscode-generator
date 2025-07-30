import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudModuleIndexFile(entityName: string) {
  return {
    name: `index.ts`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}`,
  }
}
