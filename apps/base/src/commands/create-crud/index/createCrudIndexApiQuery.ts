import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

import { getCreateCrudIndexApiQueryFile } from './createCrudIndex.files'

export async function createCrudIndexApiQuery({
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

  if (serviceSourceFile
    .getClassOrThrow(`${CaseTransformer.toPascalCase(entityName)}Service`)
    .getMethod('getAll')) {
    return
  }

  serviceSourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/index/${entityName}Index.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}Index`,
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
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/index/${entityName}IndexQueryOptions.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}IndexQueryOptions`,
    ],
  })

  serviceSourceFile
    .getClassOrThrow(`${CaseTransformer.toPascalCase(entityName)}Service`)
    .addMethod({
      isAsync: true,
      isStatic: true,
      name: `getAll`,
      leadingTrivia: `// TODO Implement the logic to fetch all ${CaseTransformer.toPascalCase(entityName)}Index items.`,
      parameters: [
        {
          name: 'paginationOptions',
          type: `PaginationOptions<${CaseTransformer.toPascalCase(entityName)}IndexQueryOptions>`,
        },
      ],
      returnType: `Promise<PaginatedData<${CaseTransformer.toPascalCase(entityName)}Index>>`,
      statements: [],
    })

  await serviceSourceFile.save()
}

async function createQueryFile(entityName: string) {
  const {
    name, path,
  } = getCreateCrudIndexApiQueryFile(entityName)

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

  querySourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'vue',
    namedImports: [
      'ComputedRef',
    ],
  })
  querySourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@wisemen/vue-core-components',
    namedImports: [
      'PaginatedData',
      'PaginationOptions',
    ],
  })
  querySourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@wisemen/vue-core-query',
    namedImports: [
      'UseQueryReturnType',
    ],
  })
  querySourceFile.addImportDeclaration({
    moduleSpecifier: '@wisemen/vue-core-query',
    namedImports: [
      'useQuery',
    ],
  })
  querySourceFile.addImportDeclaration({
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/index/${entityName}Index.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}Index`,
    ],
  })

  querySourceFile.addImportDeclaration({
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/index/${entityName}IndexQueryOptions.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}IndexQueryOptions`,
    ],
  })

  querySourceFile.addImportDeclaration({
    moduleSpecifier: `@/modules/${CaseTransformer.toKebabCase(entityName)}/api/services/${CaseTransformer.toKebabCase(entityName)}.service.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}Service`,
    ],
  })

  querySourceFile.addFunction({
    isExported: true,
    name: `use${CaseTransformer.toPascalCase(entityName)}IndexQuery`,
    leadingTrivia: `// TODO Implement the logic to fetch all ${CaseTransformer.toPascalCase(entityName)}Index items.`,
    parameters: [
      {
        name: 'paginationOptions',
        type: `ComputedRef<PaginationOptions<${CaseTransformer.toPascalCase(entityName)}IndexQueryOptions>>`,
      },
    ],
    returnType: `UseQueryReturnType<PaginatedData<${CaseTransformer.toPascalCase(entityName)}Index>>`,
    statements: [
      `return useQuery<PaginatedData<${CaseTransformer.toPascalCase(entityName)}Index>>({
        queryFn: () => {
          return ${CaseTransformer.toPascalCase(entityName)}Service.getAll(paginationOptions.value)
        },
        queryKey: {
          ${CaseTransformer.toKebabCase(entityName)}Index: {
            paginationOptions,
          },
        }
      })`,
    ],
  })

  querySourceFile.saveSync()
}
