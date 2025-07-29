import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
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
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/create/${entityName}CreateForm.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}CreateForm`,
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/${entityName}Uuid.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Uuid`,
      ],
    })
    .addImport({
      moduleSpecifier: `@/modules/${CaseTransformer.toKebabCase(entityName)}/api/services/${CaseTransformer.toKebabCase(entityName)}.service.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Service`,
      ],
    })
    .addFunction({
      isExported: true,
      name: `use${CaseTransformer.toPascalCase(entityName)}CreateMutation`,
      parameters: [],
      statements: [
        `return useMutation({
        queryFn: async ({ body }) => {
          return await ${CaseTransformer.toPascalCase(entityName)}Service.create(body)
        },
        queryKeysToInvalidate: {
          ${CaseTransformer.toKebabCase(entityName)}Index: {},
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

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/create/${entityName}CreateForm.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}CreateForm`,
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/${entityName}Uuid.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Uuid`,
      ],
    })
    .addImport({
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/create/${entityName}Create.transformer.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}CreateTransformer`,
      ],
    })
    .addClass({
      isExported: true,
      name: `${CaseTransformer.toPascalCase(entityName)}Service`,
    })
    .addClassMethod({
      isAsync: true,
      isStatic: true,
      name: `create`,
      comment: `// TODO Implement the logic to create a new ${CaseTransformer.toPascalCase(entityName)} item.`,
      nameClass: `${CaseTransformer.toPascalCase(entityName)}Service`,
      parameters: [
        {
          name: 'form',
          type: `${CaseTransformer.toPascalCase(entityName)}CreateForm`,
        },
      ],
      returnType: `Promise<${CaseTransformer.toPascalCase(entityName)}Uuid>`,
      statements: [],
    })
    .save()
}
