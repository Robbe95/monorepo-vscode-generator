import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
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
      moduleSpecifier: toFileAlias(getCreateCrudIndexModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Index`,
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
        `${entityName.pascalCase}IndexQueryOptions`,
      ],
    })
    .addClassMethod({
      isAsync: true,
      isStatic: true,
      name: `getAll`,
      comment: `// TODO Implement the logic to fetch all ${entityName.pascalCase}Index items.`,
      nameClass: `${entityName.pascalCase}Service`,
      parameters: [
        {
          name: 'paginationOptions',
          type: `PaginationOptions<${entityName.pascalCase}IndexQueryOptions>`,
        },
      ],
      returnType: `Promise<Result<PaginatedData<${entityName.pascalCase}Index>, Error>>`,
      statements: [],
    })
    .save()
}

async function createQueryFile(entityName: EntityCasing) {
  const {
    name, path,
  } = getCreateCrudIndexApiQueryFile(entityName)

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
      isTypeOnly: true,
      moduleSpecifier: '@wisemen/vue-core-components',
      namedImports: [
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
      moduleSpecifier: toFileAlias(getCreateCrudIndexQueryOptionsModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}IndexQueryOptions`,
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
      name: `use${entityName.pascalCase}IndexQuery`,
      comment: `// TODO Implement the logic to fetch all ${entityName.pascalCase}Index items.`,
      parameters: [
        {
          name: 'paginationOptions',
          type: `ComputedRef<PaginationOptions<${entityName.pascalCase}IndexQueryOptions>>`,
        },

      ],
      statements: [
        `
          return useQuery({
            queryFn: () => {
              return ${entityName.pascalCase}Service.getAll(paginationOptions.value)
            },
            queryKey: {
               ${entityName.camelCase}Index: {
                paginationOptions,
              },
            },
          })
          `,
      ],
    })
    .save()
}
