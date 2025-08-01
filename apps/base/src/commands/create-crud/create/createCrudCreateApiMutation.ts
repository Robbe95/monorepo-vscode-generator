import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import {
  getCreateCrudCreateApiMutationFile,
  getCreateCrudCreateFormModelFile,
  getCreateCrudCreateTransformerFile,
} from './createCrudCreate.files'

interface CreateCrudCreateApiMutationOptions {
  entityName: EntityCasing
}
export async function createCrudCreateApiMutation({
  entityName,
}: CreateCrudCreateApiMutationOptions) {
  await addToServiceFile(entityName)
  await createMutationFile(entityName)
}

async function createMutationFile(entityName: EntityCasing) {
  const {
    name, path,
  } = getCreateCrudCreateApiMutationFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })
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
        `${entityName.pascalCase}Uuid`,
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(serviceFile),
      namedImports: [
        `${entityName.pascalCase}Service`,
      ],
    })
    .addInterface({
      name: `${entityName.pascalCase}CreateMutationOptions`,
      properties: [
        {
          name: 'body',
          type: `{ 
            uuid: ${entityName.pascalCase}Uuid 
          }`,
        },
      ],
    })
    .addFunction({
      isExported: true,
      name: `use${entityName.pascalCase}CreateMutation`,
      parameters: [],
      statements: [],
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
        `${entityName.pascalCase}CreateForm`,
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(uuidFile),
      namedImports: [
        `${entityName.pascalCase}Uuid`,
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(transformerFile),
      namedImports: [
        `${entityName.pascalCase}CreateTransformer`,
      ],
    })
    .addClass({
      isExported: true,
      name: `${entityName.pascalCase}Service`,
    })
    .addClassMethod({
      isAsync: true,
      isStatic: true,
      name: `create`,
      comment: `// TODO Implement the logic to create a new ${entityName.pascalCase} item.`,
      nameClass: `${entityName.pascalCase}Service`,
      parameters: [
        {
          name: 'form',
          type: `${entityName.pascalCase}CreateForm`,
        },
      ],
      returnType: `Promise<Result<${entityName.pascalCase}Uuid, Error>>`,
      statements: [
        `  
            const dto = ${entityName.pascalCase}CreateTransformer.toDto(form)
            const response = await ResultAsync.fromPromise(create${entityName.pascalCase}V1({
              body: dto,
            }), () => new Error('Failed to create ${entityName.humanReadable}'))
            return response.map((res) => res.data.uuid as ${entityName.pascalCase}Uuid)
        `,
      ],
    })
    .save()
}
