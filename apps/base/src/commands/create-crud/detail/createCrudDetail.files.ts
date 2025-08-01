import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudDetailModelFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Detail.model.ts`,
    path: `src/modules/${entityName.kebabCase}/models/${entityName.kebabCase}/detail`,
  }
}
export function getCreateCrudDetailModelDtoFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}DetailDto.model.ts`,
    path: `src/modules/${entityName.kebabCase}/models/${entityName.kebabCase}/detail`,
  }
}
export function getCreateCrudDetailTransformerFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Detail.transformer.ts`,
    path: `src/modules/${entityName.kebabCase}/models/${entityName.kebabCase}/detail`,
  }
}
export function getCreateCrudDetailQueryOptionsModelFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}DetailQueryOptions.model.ts`,
    path: `src/modules/${entityName.kebabCase}/models/${entityName.kebabCase}/detail`,
  }
}

export function getCreateCrudDetailApiQueryFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Detail.query.ts`,
    path: `src/modules/${entityName.kebabCase}/api/queries`,
  }
}

export function getCreateCrudDetailViewFile(entityName: EntityCasing) {
  return {
    name: `${entityName.pascalCase}DetailView.vue`,
    path: `src/modules/${entityName.kebabCase}/features/detail/views`,
  }
}

export function getCreateCrudDetailDataProviderFile(entityName: EntityCasing) {
  return {
    name: `${entityName.pascalCase}DetailViewDataProvider.vue`,
    path: `src/modules/${entityName.kebabCase}/features/detail/views`,
  }
}
