import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudIndexModelFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Index.model.ts`,
    path: `src/modules/${entityName.kebabCase}/models/index`,
  }
}
export function getCreateCrudIndexTransformerFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Index.transformer.ts`,
    path: `src/modules/${entityName.kebabCase}/models/index`,
  }
}
export function getCreateCrudIndexQueryOptionsModelFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}IndexQueryOptions.model.ts`,
    path: `src/modules/${entityName.kebabCase}/models/index`,
  }
}

export function getCreateCrudIndexApiQueryFile(entityName: EntityCasing) {
  return {
    name: `${entityName.camelCase}Index.query.ts`,
    path: `src/modules/${entityName.kebabCase}/api/queries`,
  }
}

export function getCreateCrudIndexViewFile(entityName: EntityCasing) {
  return {
    name: `${entityName.pascalCase}IndexView.vue`,
    path: `src/modules/${entityName.kebabCase}/features/index/views`,
  }
}

export function getCreateCrudIndexViewTableFile(entityName: EntityCasing) {
  return {
    name: `${entityName.pascalCase}IndexTable.vue`,
    path: `src/modules/${entityName.kebabCase}/features/index/components`,
  }
}
