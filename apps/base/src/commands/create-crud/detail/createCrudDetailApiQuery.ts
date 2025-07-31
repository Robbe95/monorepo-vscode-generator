import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import {
  getCreateCrudDetailApiQueryFile,
  getCreateCrudDetailModelFile,
  getCreateCrudDetailTransformerFile,
} from './createCrudDetail.files'

export async function createCrudDetailApiQuery({
  entityName,
}: {
  entityName: EntityCasing
}) {
  await addToServiceFile(entityName)
  await createQueryFile(entityName)
}

async function addToServiceFile(entityName: EntityCasing) {
  const {
    name, path,
  } = getCreateCrudServiceFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudDetailModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Detail`,
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: '@wisemen/vue-core-components',
      namedImports: [
        'PaginatedData',
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudUuidModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Uuid`,
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(getCreateCrudDetailTransformerFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}DetailTransformer`,
      ],
    })
    .addClassMethod({
      isAsync: true,
      isStatic: true,
      name: `getByUuid`,
      comment: `// TODO Update the getByUuid logic to fetch a single ${entityName.pascalCase}Detail item by UUID.`,
      nameClass: `${entityName.pascalCase}Service`,
      parameters: [
        {
          name: 'uuid',
          type: `${entityName.pascalCase}Uuid`,
        },
      ],
      returnType: `Promise<${entityName.pascalCase}Detail>`,
      statements: [],
    })
    .save()
}

async function createQueryFile(entityName: EntityCasing) {
  const {
    name, path,
  } = getCreateCrudDetailApiQueryFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: 'vue',
      namedImports: [
        'ComputedRef',
      ],
    })
    .addImport({
      moduleSpecifier: 'vue',
      namedImports: [
        'toValue',
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: '@wisemen/vue-core-query',
      namedImports: [
        'UseQueryOptions',
      ],
    })
    .addImport({
      moduleSpecifier: '@wisemen/vue-core-query',
      namedImports: [
        'useQuery',
      ],
    })
    .addImport({
      moduleSpecifier: '@/composables/prefetch-query/prefetchQuery.composable',
      namedImports: [
        'usePrefetchQuery',
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudDetailModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Detail`,
      ],
    })
    .addImport({
      moduleSpecifier: '@/utils/time.util',
      namedImports: [
        'TimeUtil',
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudUuidModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Uuid`,
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(getCreateCrudServiceFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Service`,
      ],
    })
    .addFunction({
      isExported: true,
      name: `${entityName.pascalCase}DetailQuery`,
      parameters: [
        {
          name: `${entityName.camelCase}Uuid`,
          type: `ComputedRef<${entityName.pascalCase}Uuid>`,
        },
      ],
      returnType: `UseQueryOptions<${entityName.pascalCase}Detail>`,
      statements: [
        `return {
          staleTime: TimeUtil.seconds(30),
          queryFn: () => ${entityName.pascalCase}Service.getByUuid(toValue(${entityName.camelCase}Uuid)),
          queryKey: {
            ${entityName.kebabCase}Detail: {
              ${entityName.camelCase}Uuid,
            },
          },
        }`,
      ],
    })
    .addFunction({
      isExported: true,
      name: `use${entityName.pascalCase}DetailQuery`,
      parameters: [
        {
          name: `${entityName.camelCase}Uuid`,
          type: `ComputedRef<${entityName.pascalCase}Uuid>`,
        },
      ],
      statements: [
        `return useQuery(${entityName.pascalCase}DetailQuery(${entityName.camelCase}Uuid))`,
      ],
    })
    .addFunction({
      isExported: true,
      name: `use${entityName.pascalCase}DetailPrefetchQuery`,
      parameters: [
        {
          name: `${entityName.camelCase}Uuid`,
          type: `ComputedRef<${entityName.pascalCase}Uuid>`,
        },
      ],
      statements: [
        `return usePrefetchQuery(${entityName.pascalCase}DetailQuery(${entityName.camelCase}Uuid))`,
      ],
    })
    .save()
}
