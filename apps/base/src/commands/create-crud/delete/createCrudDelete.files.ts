import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudDeleteApiMutationFile(entityName: string) {
  return {
    name: `${entityName}Delete.mutation.ts`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/api/mutations`,
  }
}
