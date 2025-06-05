import { CaseTransformer } from "#utils/casing/caseTransformer.utils.ts";

export function getCreateCrudUuidModelFile(entityName: string) {
  return {
    name: `${entityName}Uuid.model.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}`,
  }
}
