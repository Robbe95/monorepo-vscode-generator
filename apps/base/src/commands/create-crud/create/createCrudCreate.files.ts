import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudCreateFormModelFile(entityName: string) {
  return {
    name: `${entityName}CreateForm.model.ts`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/models/create`,
  }
}

export function getCreateCrudCreateTransformerFile(entityName: string) {
  return {
    name: `${entityName}Create.transformer.ts`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/models/create`,
  }
}

export function getCreateCrudCreateApiMutationFile(entityName: string) {
  return {
    name: `${entityName}Create.mutation.ts`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/api/mutations`,
  }
}

export function getCreateCrudCreateViewFile(entityName: string) {
  return {
    name: `${CaseTransformer.toPascalCase(entityName)}CreateView.vue`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/features/create/views`,
  }
}

export function getCreateCrudCreateFormFile(entityName: string) {
  return {
    name: `${CaseTransformer.toPascalCase(entityName)}CreateForm.vue`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/features/create/components`,
  }
}
