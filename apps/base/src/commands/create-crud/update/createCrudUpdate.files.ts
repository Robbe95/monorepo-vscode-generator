import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudUpdateFormModelFile(entityName: string) {
  return {
    name: `${entityName}UpdateForm.model.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}/update`,
  }
}

export function getCreateCrudUpdateTransformerFile(entityName: string) {
  return {
    name: `${entityName}Update.transformer.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}/update`,
  }
}

export function getCreateCrudUpdateApiMutationFile(entityName: string) {
  return {
    name: `${entityName}Update.mutation.ts`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/api/mutations`,
  }
}
