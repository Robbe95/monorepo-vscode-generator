import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudCreateFormModelFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}CreateForm.model.ts`,
    path: `src/modules/${entityName.kebabCase}/models/create`,
  }
}

export function getCreateCrudCreateTransformerFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Create.transformer.ts`,
    path: `src/modules/${entityName.kebabCase}/models/create`,
  }
}

export function getCreateCrudCreateApiMutationFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Create.mutation.ts`,
    path: `src/modules/${entityName.kebabCase}/api/mutations`,
  }
}

export function getCreateCrudCreateViewFile(entityName: EntityCasing) {
  return {
    name: `${entityName.pascalCase}CreateView.vue`,
    path: `src/modules/${entityName.kebabCase}/features/create/views`,
  }
}

export function getCreateCrudCreateFormFile(entityName: EntityCasing) {
  return {
    name: `${entityName.pascalCase}CreateForm.vue`,
    path: `src/modules/${entityName.kebabCase}/features/create/components`,
  }
}
