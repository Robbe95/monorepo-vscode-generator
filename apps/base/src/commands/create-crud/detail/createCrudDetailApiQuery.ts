import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

import { getCreateCrudDetailApiQueryFile } from './createCrudDetail.files'

export async function createCrudDetailApiQuery({
  entityName,
}: {
  entityName: string
}) {
  await addToServiceFile(entityName)
  await createQueryFile(entityName)
}

async function addToServiceFile(entityName: string) {
  const {
    name, path,
  } = getCreateCrudServiceFile(entityName)

  const serviceSourceFile = await getTsSourceFile({
    filePath: `${path}/${name}`,
    projectPath: BASE_PATH,
  })

  const existingMethod = serviceSourceFile
    .getClassOrThrow(`${CaseTransformer.toPascalCase(entityName)}Service`)
    .getMethod('getByUuid')

  if (existingMethod) {
    return
  }

  serviceSourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/detail/${entityName}Detail.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}Detail`,
    ],
  })

  serviceSourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@wisemen/vue-core-components',
    namedImports: [
      'PaginatedData',
    ],
  })

  serviceSourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/${entityName}Uuid.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}Uuid`,
    ],
  })

  serviceSourceFile
    .addImportDeclaration({
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/detail/${entityName}Detail.transformer.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}DetailTransformer`,
      ],
    })

  serviceSourceFile
    .getClassOrThrow(`${CaseTransformer.toPascalCase(entityName)}Service`)
    .addMethod({
      isAsync: true,
      isStatic: true,
      name: `getByUuid`,
      leadingTrivia: `// TODO Update the update logic to fetch a single ${CaseTransformer.toPascalCase(entityName)}Detail item by UUID.`,
      parameters: [
        {
          name: 'uuid',
          type: `${CaseTransformer.toPascalCase(entityName)}Uuid`,
        },
      ],
      returnType: `Promise<${CaseTransformer.toPascalCase(entityName)}Detail>`,
      statements: [],
    })

  serviceSourceFile.saveSync()
}

async function createQueryFile(entityName: string) {
  const {
    name, path,
  } = getCreateCrudDetailApiQueryFile(entityName)

  const sourceFileResponse = await tryCatch(createEmptyFile ({
    name,
    projectPath: BASE_PATH,
    path,
  }))

  if (sourceFileResponse.error) {
    await skipFile({
      name,
      path,
    })

    return
  }

  const querySourceFile = sourceFileResponse.data

  querySourceFile.addImportDeclarations([
    {
      isTypeOnly: true,
      moduleSpecifier: 'vue',
      namedImports: [
        'ComputedRef',
      ],
    },
    {
      moduleSpecifier: 'vue',
      namedImports: [
        'toValue',
      ],
    },
    {
      isTypeOnly: true,
      moduleSpecifier: '@wisemen/vue-core-query',
      namedImports: [
        'UseQueryReturnType',
        'UseQueryOptions',
      ],
    },
    {
      moduleSpecifier: '@wisemen/vue-core-query',
      namedImports: [
        'useQuery',
      ],
    },
    {
      isTypeOnly: true,
      moduleSpecifier: '@/composables/prefetch-query/prefetchQuery.composable',
      namedImports: [
        'PrefetchQueryReturnType',
      ],
    },
    {
      moduleSpecifier: '@/composables/prefetch-query/prefetchQuery.composable',
      namedImports: [
        'usePrefetchQuery',
      ],
    },
    {
      isTypeOnly: true,
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/detail/${entityName}Detail.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Detail`,
      ],
    },
    {
      moduleSpecifier: '@/utils/time.util',
      namedImports: [
        'TimeUtil',
      ],
    },
    {
      isTypeOnly: true,
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/${entityName}Uuid.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Uuid`,
      ],
    },
    {
      moduleSpecifier: `@/modules/${CaseTransformer.toKebabCase(entityName)}/api/services/${CaseTransformer.toKebabCase(entityName)}.service.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Service`,
      ],
    },
  ])

  querySourceFile.addFunction({
    isExported: true,
    name: `${entityName}DetailQuery`,
    parameters: [
      {
        name: `${entityName}Uuid`,
        type: `ComputedRef<${CaseTransformer.toPascalCase(entityName)}Uuid>`,
      },
    ],
    returnType: `UseQueryOptions<${CaseTransformer.toPascalCase(entityName)}Detail>`,
    statements: [
      `return {
        staleTime: TimeUtil.seconds(30),
        queryFn: () => ${CaseTransformer.toPascalCase(entityName)}Service.getByUuid(toValue(${entityName}Uuid)),
        queryKey: {
          ${CaseTransformer.toKebabCase(entityName)}Detail: {
            ${entityName}Uuid,
          },
        },
      }`,
    ],
  })

  querySourceFile.addFunction({
    isExported: true,
    name: `use${CaseTransformer.toPascalCase(entityName)}DetailQuery`,
    parameters: [
      {
        name: `${entityName}Uuid`,
        type: `ComputedRef<${CaseTransformer.toPascalCase(entityName)}Uuid>`,
      },
    ],
    returnType: `UseQueryReturnType<${CaseTransformer.toPascalCase(entityName)}Detail>`,
    statements: [
      `return useQuery(${entityName}DetailQuery(${entityName}Uuid))`,
    ],
  })

  querySourceFile.addFunction({
    isExported: true,
    name: `use${CaseTransformer.toPascalCase(entityName)}DetailPrefetchQuery`,
    parameters: [
      {
        name: `${entityName}Uuid`,
        type: `ComputedRef<${CaseTransformer.toPascalCase(entityName)}Uuid>`,
      },
    ],
    returnType: `PrefetchQueryReturnType`,
    statements: [
      `return usePrefetchQuery(${entityName}DetailQuery(${entityName}Uuid))`,
    ],
  })

  querySourceFile.saveSync()
}
