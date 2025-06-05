import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudServiceFile(entityName: string) {
  return {
    name: `${entityName}.service.ts`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/api/services`,
  }
}
