import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudUpdateFormModelFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}UpdateForm.model.ts`,
    path: `src/modules/${entityName.kebabCase}/models/${entityName.kebabCase}/update`,
  }
}

export function getCreateCrudUpdateTransformerFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Update.transformer.ts`,
    path: `src/modules/${entityName.kebabCase}/models/${entityName.kebabCase}/update`,
  }
}

export function getCreateCrudUpdateApiMutationFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Update.mutation.ts`,
    path: `src/modules/${entityName.kebabCase}/api/mutations`,
  }
}

export function getCreateCrudUpdateDataProviderViewFile(entityName: EntityCasing) {
  return {
    name: `${entityName.pascalCase}UpdateDataProviderView.vue`,
    path: `src/modules/${entityName.kebabCase}/features/update/views`,
  }
}

export function getCreateCrudUpdateViewFile(entityName: EntityCasing) {
  return {
    name: `${entityName.pascalCase}UpdateView.vue`,
    path: `src/modules/${entityName.kebabCase}/features/update/views`,
  }
}

export function getCreateCrudUpdateFormFile(entityName: EntityCasing) {
  return {
    name: `${entityName.pascalCase}UpdateForm.vue`,
    path: `src/modules/${entityName.kebabCase}/features/update/components`,
  }
}
