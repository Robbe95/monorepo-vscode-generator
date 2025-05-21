import { VariableDeclarationKind } from 'ts-morph'

import { NUXT_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/entityCasing.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

import {
  getContractDetailName,
  getContractIndexName,
} from './createNewEntityContract'

interface CreateNewEntityNuxtApiInput {
  entityName: string
  layerName: string
}

function getIndexQueryFileName(entityName: string) {
  return `use${CaseTransformer.toPascalCase(getContractIndexName(entityName))}.query.ts`
}

function getDetailQueryFileName(entityName: string) {
  return `use${CaseTransformer.toPascalCase(getContractDetailName(entityName))}.query.ts`
}

function getLayerApiFolderPath({
  entityName, layerName,
}: CreateNewEntityNuxtApiInput) {
  return `layers/${CaseTransformer.toKebabCase(layerName)}/api/${CaseTransformer.toKebabCase(entityName)}`
}

function getLayerApiFullPath({
  entityName, layerName,
}: CreateNewEntityNuxtApiInput) {
  return `${getRootFolder()}/${NUXT_PATH}/${getLayerApiFolderPath({
    entityName,
    layerName,
  })}`
}

export function createNewEntityNuxtApi({
  entityName, layerName,
}: CreateNewEntityNuxtApiInput) {
  createIndexQueryFile({
    entityName,
    layerName,
  })
  createDetailQueryFile({
    entityName,
    layerName,
  })
}

function createIndexQueryFile({
  entityName, layerName,
}: CreateNewEntityNuxtApiInput) {
  const queryPath = `${getLayerApiFullPath({
    entityName,
    layerName,
  })}/query`

  createEmptyFile({
    name: getIndexQueryFileName(entityName),
    projectPath: NUXT_PATH,
    path: `${queryPath}`,
  })

  const indexQuerySourceFile = getTsSourceFile({
    filePath: `${getLayerApiFolderPath({
      entityName,
      layerName,
    })}/query/${getIndexQueryFileName(entityName)}`,
    projectPath: NUXT_PATH,
  })

  indexQuerySourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@tanstack/vue-query',
    namedImports: [
      'QueryKey',
    ],
  })

  indexQuerySourceFile.addImportDeclaration({
    moduleSpecifier: '@tanstack/vue-query',
    namedImports: [
      'useInfiniteQuery',
    ],
  })

  indexQuerySourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@tanstack/vue-query',
    namedImports: [
      'QueryKey',
    ],
  })

  indexQuerySourceFile.addImportDeclaration({
    moduleSpecifier: '~base/composables/api/useOrpc',
    namedImports: [
      'useOrpcQuery',
    ],
  })

  indexQuerySourceFile.addImportDeclaration({
    moduleSpecifier: '~base/composables/i18n/useGlobalI18n',
    namedImports: [
      'useGlobalI18n',
    ],
  })

  indexQuerySourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@repo/models',
    namedImports: [
      `Client${CaseTransformer.toPascalCase(entityName)}IndexFilter`,
      'PaginationInput',
    ],
  })

  indexQuerySourceFile.addInterface({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(entityName)}IndexQueryOptions`,
    properties: [
      {
        name: 'filter',
        type: `MaybeRefOrGetter<Client${CaseTransformer.toPascalCase(entityName)}IndexFilter>`,
      },
    ],
  })

  indexQuerySourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${CaseTransformer.toUpperCase(entityName)}_PAGINATION_LIMIT`,
        initializer: '20',
        type: 'number',
      },
    ],
  })

  const queryFunction = indexQuerySourceFile.addFunction({
    isExported: true,
    name: `useGet${CaseTransformer.toPascalCase(entityName)}IndexQuery`,
    leadingTrivia: `//TODO: This file was generated. Add your ${entityName} index query logic here`,
    parameters: [
      {
        name: '{ filter }',
        type: `{ filter: ${CaseTransformer.toPascalCase(entityName)}IndexQueryOptions }`,
      },
    ],
  })

  queryFunction.setBodyText(`
    const orpcQuery = useOrpcQuery()
    const {
      locale,
    } = useGlobalI18n()

    const infiniteOptions = orpcQuery.${entityName}.${getContractIndexName(entityName)}.infiniteOptions({
      getNextPageParam: (lastPage) => {
        if (!lastPage.hasNextPage) {
          return
        }

        return {
          skip: lastPage.skip + lastPage.take,
          take: lastPage.take,
        }
      },
      initialPageParam: {
        skip: 0,
        take: ${CaseTransformer.toUpperCase(entityName)}_PAGINATION_LIMIT,
      },
      input: (pageParam: PaginationInput) => ({
        filter: toValue(filter),
        pagination: pageParam,
      }),
    })

    const queryKey = computed<QueryKey>(() => {
      return [
        infiniteOptions.queryKey,
        locale.value,
      ]
    })

    return useInfiniteQuery({
      ...infiniteOptions,
      queryKey,
    })
  `)

  indexQuerySourceFile.saveSync()
}

function createDetailQueryFile({
  entityName, layerName,
}: CreateNewEntityNuxtApiInput) {
  const queryPath = `${getLayerApiFullPath({
    entityName,
    layerName,
  })}/query`

  createEmptyFile({
    name: getDetailQueryFileName(entityName),
    projectPath: NUXT_PATH,
    path: `${queryPath}`,
  })

  const detailQuerySourceFile = getTsSourceFile({
    filePath: `${getLayerApiFolderPath({
      entityName,
      layerName,
    })}/query/${getDetailQueryFileName(entityName)}`,
    projectPath: NUXT_PATH,
  })

  detailQuerySourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@tanstack/vue-query',
    namedImports: [
      'QueryKey',
    ],
  })

  detailQuerySourceFile.addImportDeclaration({
    moduleSpecifier: '~base/composables/api/useOrpc',
    namedImports: [
      'useOrpcQuery',
    ],
  })

  detailQuerySourceFile.addImportDeclaration({
    moduleSpecifier: '~base/composables/i18n/useGlobalI18n',
    namedImports: [
      'useGlobalI18n',
    ],
  })

  detailQuerySourceFile.addImportDeclaration({
    moduleSpecifier: '~base/composables/query/useQuery',
    namedImports: [
      'useQuery',
    ],
  })

  const queryFunction = detailQuerySourceFile.addFunction({
    isExported: true,
    name: `useGet${CaseTransformer.toPascalCase(entityName)}DetailQuery`,
    leadingTrivia: `//TODO: This file was generated. Add your ${entityName} detail query logic here`,
    parameters: [
      {
        name: '{ id }',
        type: '{ id: MaybeRefOrGetter<string> }',
      },
    ],
  })

  queryFunction.setBodyText(`
    const orpcQuery = useOrpcQuery()
    const {
      locale,
    } = useGlobalI18n()

    const queryKey = computed<QueryKey>(() => orpcQuery.${entityName}.${getContractDetailName(entityName)}.key({
      input: {
        id: toValue(id),
      },
      type: 'query',
    }))

    return useQuery(orpcQuery.${entityName}.${getContractDetailName(entityName)}.queryOptions({
      input: computed<{ id: string }>(() => ({
        id: toValue(id),
      })),
      queryKey: computed<QueryKey>(() => [
        queryKey.value,
        locale.value,
      ]),
    }))
  `)

  detailQuerySourceFile.saveSync()
}
