import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { getCases } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import {
  getCreateCrudCreateApiMutationFile,
  getCreateCrudCreateFormModelFile,
  getCreateCrudCreateTransformerFile,
} from './createCrudCreate.files'

interface CreateCrudCreateApiMutationOptions {
  entityName: string
}
export async function createCrudCreateApiMutation({
  entityName,
}: CreateCrudCreateApiMutationOptions) {
  await addToServiceFile(entityName)
  await createMutationFile(entityName)
}

async function createMutationFile(entityName: string) {
  const {
    name, path,
  } = getCreateCrudCreateApiMutationFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })
  const entityCasings = getCases(entityName)
  const uuidFile = getCreateCrudUuidModelFile(entityName)
  const serviceFile = getCreateCrudServiceFile(entityName)

  fileManipulator
    .addImport({
      moduleSpecifier: `@wisemen/vue-core-query`,
      namedImports: [
        'useMutation',
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(uuidFile),
      namedImports: [
        `${entityCasings.pascalCase}Uuid`,
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(serviceFile),
      namedImports: [
        `${entityCasings.pascalCase}Service`,
      ],
    })
    .addInterface({
      name: `${entityCasings.pascalCase}CreateMutationOptions`,
      properties: [
        {
          name: 'body',
          type: `{ 
            uuid: ${entityCasings.pascalCase}Uuid 
          }`,
        },
      ],
    })
    .addFunction({
      isExported: true,
      name: `use${entityCasings.pascalCase}CreateMutation`,
      parameters: [],
      statements: [
        `return useMutation({
        queryFn: async ({ body }: ${entityCasings.pascalCase}CreateMutationOptions) => {
          return await ${entityCasings.pascalCase}Service.create(body)
        },
        queryKeysToInvalidate: {
          ${entityCasings.kebabCase}Index: {},
        },
      })`,
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
  const entityCasings = getCases(entityName)
  const createFormFile = getCreateCrudCreateFormModelFile(entityName)
  const uuidFile = getCreateCrudUuidModelFile(entityName)
  const transformerFile = getCreateCrudCreateTransformerFile(entityName)

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: 'neverthrow',
      namedImports: [
        'Result',
      ],
    })
    .addImport({
      moduleSpecifier: 'neverthrow',
      namedImports: [
        'ResultAsync',
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(createFormFile),
      namedImports: [
        `${entityCasings.pascalCase}CreateForm`,
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(uuidFile),
      namedImports: [
        `${entityCasings.pascalCase}Uuid`,
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(transformerFile),
      namedImports: [
        `${entityCasings.pascalCase}CreateTransformer`,
      ],
    })
    .addClass({
      isExported: true,
      name: `${entityCasings.pascalCase}Service`,
    })
    .addClassMethod({
      isAsync: true,
      isStatic: true,
      name: `create`,
      comment: `// TODO Implement the logic to create a new ${entityCasings.pascalCase} item.`,
      nameClass: `${entityCasings.pascalCase}Service`,
      parameters: [
        {
          name: 'form',
          type: `${entityCasings.pascalCase}CreateForm`,
        },
      ],
      returnType: `Promise<Result<${entityCasings.pascalCase}Uuid, Error>>`,
      statements: [
        `  
            const dto = ${entityCasings.pascalCase}CreateTransformer.toDto(form)
            const response = await ResultAsync.fromPromise(create${entityCasings.pascalCase}V1({
              body: dto,
            }), () => new Error('Failed to create ${entityCasings.humanReadable}'))
            return response.map((res) => res.data.uuid as ${entityCasings.pascalCase}Uuid)
        `,
      ],
    })
    .save()
}
