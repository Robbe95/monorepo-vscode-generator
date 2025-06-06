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

export function getCreateCrudUpdateDataProviderViewFile(entityName: string) {
  return {
    name: `${CaseTransformer.toPascalCase(entityName)}UpdateDataProviderView.vue`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/features/update/views`,
  }
}

export function getCreateCrudUpdateViewFile(entityName: string) {
  return {
    name: `${CaseTransformer.toPascalCase(entityName)}UpdateView.vue`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/features/update/views`,
  }
}

export function getCreateCrudUpdateFormFile(entityName: string) {
  return {
    name: `${CaseTransformer.toPascalCase(entityName)}UpdateForm.vue`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/features/update/components`,
  }
}
