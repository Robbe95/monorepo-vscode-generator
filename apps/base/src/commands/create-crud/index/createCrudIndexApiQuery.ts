import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { allCases } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import {
  getCreateCrudIndexApiQueryFile,
  getCreateCrudIndexModelFile,
  getCreateCrudIndexQueryOptionsModelFile,
} from './createCrudIndex.files'

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

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  const entityCasing = allCases(entityName)

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudIndexModelFile(entityName)),
      namedImports: [
        `${entityCasing.pascalCase}Index`,
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: '@wisemen/vue-core-components',
      namedImports: [
        'PaginationOptions',
        'PaginatedData',
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudIndexQueryOptionsModelFile(entityName)),
      namedImports: [
        `${entityCasing.pascalCase}IndexQueryOptions`,
      ],
    })
    .addClassMethod({
      isAsync: true,
      isStatic: true,
      name: `getAll`,
      comment: `// TODO Implement the logic to fetch all ${entityCasing.pascalCase}Index items.`,
      nameClass: `${entityCasing.pascalCase}Service`,
      parameters: [
        {
          name: 'paginationOptions',
          type: `PaginationOptions<${entityCasing.pascalCase}IndexQueryOptions>`,
        },
      ],
      returnType: `Promise<PaginatedData<${entityCasing.pascalCase}Index>>`,
      statements: [],
    })
    .save()
}

async function createQueryFile(entityName: string) {
  const {
    name, path,
  } = getCreateCrudIndexApiQueryFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  const entityCasing = allCases(entityName)

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: 'vue',
      namedImports: [
        'ComputedRef',
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: '@wisemen/vue-core-components',
      namedImports: [
        'PaginatedData',
        'PaginationOptions',
      ],
    })
    .addImport({
      moduleSpecifier: '@wisemen/vue-core-query',
      namedImports: [
        'useQuery',
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(getCreateCrudIndexModelFile(entityName)),
      namedImports: [
        `${entityCasing.pascalCase}Index`,
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(getCreateCrudIndexQueryOptionsModelFile(entityName)),
      namedImports: [
        `${entityCasing.pascalCase}IndexQueryOptions`,
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(getCreateCrudServiceFile(entityName)),
      namedImports: [
        `${entityCasing.pascalCase}Service`,
      ],
    })
    .addFunction({
      isExported: true,
      name: `use${entityCasing.pascalCase}IndexQuery`,
      comment: `// TODO Implement the logic to fetch all ${entityCasing.pascalCase}Index items.`,
      parameters: [
        {
          name: 'paginationOptions',
          type: `ComputedRef<PaginationOptions<${entityCasing.pascalCase}IndexQueryOptions>>`,
        },

      ],
      statements: [
        `
          return useQuery({
            queryFn: () => {
              return ${entityCasing.pascalCase}Service.getAll(paginationOptions.value)
            },
            queryKey: {
               ${entityCasing.camelCase}Index: {
                paginationOptions,
              },
            },
          })
          `,
      ],
    })
    .save()
}
