import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { getCases } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'

import { getCreateCrudCreateApiMutationFile } from './createCrudCreate.files'

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

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: `@wisemen/vue-core-query`,
      namedImports: [
        'UseMutationReturnType',
      ],
    })
    .addImport({
      moduleSpecifier: `@wisemen/vue-core-query`,
      namedImports: [
        'useMutation',
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: `@/models/${entityCasings.kebabCase}/create/${entityCasings.camelCase}CreateForm.model.ts`,
      namedImports: [
        `${entityCasings.pascalCase}CreateForm`,
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: `@/models/${entityCasings.kebabCase}/${entityCasings.camelCase}Uuid.model.ts`,
      namedImports: [
        `${entityCasings.pascalCase}Uuid`,
      ],
    })
    .addImport({
      moduleSpecifier: `@/modules/${entityCasings.kebabCase}/api/services/${entityCasings.kebabCase}.service.ts`,
      namedImports: [
        `${entityCasings.pascalCase}Service`,
      ],
    })
    .addFunction({
      isExported: true,
      name: `use${entityCasings.pascalCase}CreateMutation`,
      parameters: [],
      statements: [
        `return useMutation({
        queryFn: async ({ body }) => {
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

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: `@/models/${entityCasings.kebabCase}/create/${entityCasings.camelCase}CreateForm.model.ts`,
      namedImports: [
        `${entityCasings.pascalCase}CreateForm`,
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: `@/models/${entityCasings.kebabCase}/${entityCasings.camelCase}Uuid.model.ts`,
      namedImports: [
        `${entityCasings.pascalCase}Uuid`,
      ],
    })
    .addImport({
      moduleSpecifier: `@/models/${entityCasings.kebabCase}/create/${entityCasings.camelCase}Create.transformer.ts`,
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
      returnType: `Promise<${entityCasings.pascalCase}Uuid>`,
      statements: [],
    })
    .save()
}
