import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { allCases } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import { getCreateCrudDeleteApiMutationFile } from './createCrudDelete.files'

interface CreateCrudDeleteApiMutationOptions {
  entityName: string
}
export async function createCrudDeleteApiMutation({
  entityName,
}: CreateCrudDeleteApiMutationOptions) {
  await createMutationFile(entityName)
  await addToServiceFile(entityName)
}

async function createMutationFile(entityName: string) {
  const {
    name, path,
  } = getCreateCrudDeleteApiMutationFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  const entityCasings = allCases(entityName)

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
        `${entityCasings.pascalCase}Uuid`,
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(getCreateCrudServiceFile(entityName)),
      namedImports: [
        `${entityCasings.pascalCase}Service`,
      ],
    })
    .addInterface({
      name: `${entityCasings.pascalCase}DeleteMutationParams`,
      properties: [
        {
          name: `${entityCasings.camelCase}Uuid`,
          type: `${entityCasings.pascalCase}Uuid`,
        },
      ],
    })
    .addFunction({
      isExported: true,
      name: `use${entityCasings.pascalCase}DeleteMutation`,
      parameters: [],
      statements: [
        `
          return useMutation({
            queryFn: async (queryOptions: { params: ${entityCasings.pascalCase}DeleteMutationParams }) => {
              return await ${entityCasings.pascalCase}Service.delete(queryOptions.params.${entityCasings.camelCase}Uuid)
            },
            queryKeysToInvalidate: {
              ${entityCasings.camelCase}Index: {},
            },
          })
        `,
      ],
    })
    .save()
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
  const entityCasings = allCases(entityName)

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudUuidModelFile(entityName)),
      namedImports: [
        `${entityCasings.pascalCase}Uuid`,
      ],
    })
    .addClassMethod({
      isAsync: true,
      isStatic: true,
      name: `delete`,
      comment: `// TODO Implement the logic to delete a ${entityCasings.pascalCase} item.`,
      nameClass: `${entityCasings.pascalCase}Service`,
      parameters: [
        {
          name: `${entityCasings.camelCase}Uuid`,
          type: `${entityCasings.pascalCase}Uuid`,
        },
      ],
      returnType: `Promise<void>`,
      statements: [],
    })
    .save()
}
