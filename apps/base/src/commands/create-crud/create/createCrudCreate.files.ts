import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudCreateFormModelFile(entityName: string) {
  return {
    name: `${entityName}CreateForm.model.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}/create`,
  }
}

export function getCreateCrudCreateTransformerFile(entityName: string) {
  return {
    name: `${entityName}Create.transformer.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}/create`,
  }
}

export function getCreateCrudCreateApiMutationFile(entityName: string) {
  return {
    name: `${entityName}Create.mutation.ts`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/api/mutations`,
  }
}
