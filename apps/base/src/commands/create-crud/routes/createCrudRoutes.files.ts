import { CaseTransformer } from "#utils/casing/caseTransformer.utils.ts";

export function getCreateCrudRoutesFile(entityName: string) {
  return {
    name: `${entityName}.routes.ts`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/routes`,
  }
}
