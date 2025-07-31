import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import {
  getCreateCrudUpdateApiMutationFile,
  getCreateCrudUpdateFormModelFile,
  getCreateCrudUpdateTransformerFile,
} from './createCrudUpdate.files'

interface CreateCrudUpdateApiMutationOptions {
  entityName: EntityCasing
}
export async function createCrudUpdateApiMutation({
  entityName,
}: CreateCrudUpdateApiMutationOptions) {
  await addToServiceFile(entityName)
  await createMutationFile(entityName)
}

async function createMutationFile(entityName: EntityCasing) {
  const {
    name, path,
  } = getCreateCrudUpdateApiMutationFile(entityName)

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
      moduleSpecifier: toFileAlias(getCreateCrudUpdateFormModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}UpdateForm`,
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
      moduleSpecifier: toFileAlias(getCreateCrudUpdateApiMutationFile(entityName)),
      namedImports: [
        `use${entityName.pascalCase}UpdateMutation`,
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(getCreateCrudServiceFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Service`,
      ],
    })
    .addInterface({
      name: `${entityName.pascalCase}UpdateMutationOptions`,
      properties: [
        {
          name: 'params',
          type: `{ 
            uuid: ${entityName.pascalCase}Uuid 
          }`,
        },
        {
          name: 'body',
          type: `${entityName.pascalCase}UpdateForm`,
        },
      ],
    })
    .addFunction({
      isExported: true,
      name: `use${entityName.pascalCase}UpdateMutation`,
      parameters: [],
      statements: [
        `return useMutation({
        queryFn: async ({ body, params }: ${entityName.pascalCase}UpdateMutationOptions) => {
          await ${entityName.pascalCase}Service.update(params.${entityName.camelCase}Uuid, body)
        },
        queryKeysToInvalidate: {
          ${entityName.camelCase}Detail: {
            ${entityName.camelCase}Uuid: (params) => params.${entityName.camelCase}Uuid,
          },
          ${entityName.camelCase}Index: {},  
        },
      })`,
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
      moduleSpecifier: toFileAlias(getCreateCrudUpdateFormModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}UpdateForm`,
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
      moduleSpecifier: toFileAlias(getCreateCrudUpdateTransformerFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}UpdateTransformer`,
      ],
    })
    .addClassMethod({
      isAsync: true,
      isStatic: true,
      name: `update`,
      comment: `// TODO Implement the logic to update an existing ${entityName.pascalCase} item.`,
      nameClass: `${entityName.pascalCase}Service`,
      parameters: [
        {
          name: `${entityName}Uuid`,
          type: `${entityName.pascalCase}Uuid`,
        },
        {
          name: 'form',
          type: `${entityName.pascalCase}UpdateForm`,
        },
      ],
      returnType: `Promise<void>`,
      statements: [],
    })
    .save()
}
