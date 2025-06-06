import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'

export function getCreateCrudDetailModelFile(entityName: string) {
  return {
    name: `${entityName}Detail.model.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}/detail`,
  }
}
export function getCreateCrudDetailModelDtoFile(entityName: string) {
  return {
    name: `${entityName}DetailDto.model.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}/detail`,
  }
}
export function getCreateCrudDetailTransformerFile(entityName: string) {
  return {
    name: `${entityName}Detail.transformer.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}/detail`,
  }
}
export function getCreateCrudDetailQueryOptionsModelFile(entityName: string) {
  return {
    name: `${entityName}DetailQueryOptions.model.ts`,
    path: `src/models/${CaseTransformer.toKebabCase(entityName)}/detail`,
  }
}

export function getCreateCrudDetailApiQueryFile(entityName: string) {
  return {
    name: `${entityName}Detail.query.ts`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/api/queries`,
  }
}

export function getCreateCrudDetailViewFile(entityName: string) {
  return {
    name: `${CaseTransformer.toPascalCase(entityName)}DetailView.vue`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/features/detail/views`,
  }
}

export function getCreateCrudDetailDataProviderFile(entityName: string) {
  return {
    name: `${CaseTransformer.toPascalCase(entityName)}DetailDataProvider.vue`,
    path: `src/modules/${CaseTransformer.toKebabCase(entityName)}/features/detail/views`,
  }
}
