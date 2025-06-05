import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudIndexModelFile(entityName: string) {
  return {
    name: `${entityName}Index.model.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}/index`,
  }
}
export function getCreateCrudIndexModelDtoFile(entityName: string) {
  return {
    name: `${entityName}IndexDto.model.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}/index`,
  }
}
export function getCreateCrudIndexTransformerFile(entityName: string) {
  return {
    name: `${entityName}Index.transformer.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}/index`,
  }
}
export function getCreateCrudIndexQueryOptionsModelFile(entityName: string) {
  return {
    name: `${entityName}IndexQueryOptions.model.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}/index`,
  }
}

export function getCreateCrudIndexApiQueryFile(entityName: string) {
  return {
    name: `${entityName}Index.query.ts`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/api/queries`,
  }
}

export function getCreateCrudIndexViewFile(entityName: string) {
  return {
    name: `${CaseTransformer.toPascalCase(entityName)}IndexView.vue`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/features/index/views`,
  }
}

export function getCreateCrudIndexViewTableFile(entityName: string) {
  return {
    name: `${CaseTransformer.toPascalCase(entityName)}IndexTable.vue`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/features/index/components`,
  }
}
