import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import { getCreateCrudDeleteApiMutationFile } from './createCrudDelete.files'

interface CreateCrudDeleteApiMutationOptions {
  entityName: EntityCasing
}
export async function createCrudDeleteApiMutation({
  entityName,
}: CreateCrudDeleteApiMutationOptions) {
  await createMutationFile(entityName)
  await addToServiceFile(entityName)
}

async function createMutationFile(entityName: EntityCasing) {
  const {
    name, path,
  } = getCreateCrudDeleteApiMutationFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addImport({
      moduleSpecifier: `@wisemen/vue-core-query`,
      namedImports: [
        'useMutation',
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
    .addInterface({
      name: `${entityName.pascalCase}DeleteMutationParams`,
      properties: [
        {
          name: `${entityName.camelCase}Uuid`,
          type: `${entityName.pascalCase}Uuid`,
        },
      ],
    })
    .addFunction({
      isExported: true,
      name: `use${entityName.pascalCase}DeleteMutation`,
      parameters: [],
      statements: [
        `
          return useMutation({
            queryFn: async (queryOptions: { params: ${entityName.pascalCase}DeleteMutationParams }) => {
              return await ${entityName.pascalCase}Service.delete(queryOptions.params.${entityName.camelCase}Uuid)
            },
            queryKeysToInvalidate: {
              ${entityName.camelCase}Index: {},
            },
          })
        `,
      ],
    })
    .save()
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
      moduleSpecifier: toFileAlias(getCreateCrudUuidModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Uuid`,
      ],
    })
    .addClassMethod({
      isAsync: true,
      isStatic: true,
      name: `delete`,
      comment: `// TODO Implement the logic to delete a ${entityName.pascalCase} item.`,
      nameClass: `${entityName.pascalCase}Service`,
      parameters: [
        {
          name: `${entityName.camelCase}Uuid`,
          type: `${entityName.pascalCase}Uuid`,
        },
      ],
      returnType: `Promise<void>`,
      statements: [],
    })
    .save()
}
