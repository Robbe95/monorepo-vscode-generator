import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

import { getCreateCrudDeleteApiMutationFile } from './createCrudDelete.files'

interface CreateCrudDeleteApiMutationOptions {
  entityName: string
}
export async function createCrudDeleteApiMutation({
  entityName,
}: CreateCrudDeleteApiMutationOptions) {
  await addToServiceFile(entityName)
  await createMutationFile(entityName)
}

async function createMutationFile(entityName: string) {
  const {
    name, path,
  } = getCreateCrudDeleteApiMutationFile(entityName)
  const sourceFileResponse = await tryCatch(createEmptyFile ({
    name,
    projectPath: BASE_PATH,
    path,
  }))

  if (sourceFileResponse.error) {
    await skipFile({
      name,
      path,
    })

    return
  }

  const sourceFile = sourceFileResponse.data

  sourceFile.addImportDeclarations([
    {
      isTypeOnly: true,
      moduleSpecifier: `@wisemen/vue-core-query`,
      namedImports: [
        'UseMutationReturnType',
      ],
    },
    {
      moduleSpecifier: `@wisemen/vue-core-query`,
      namedImports: [
        'useMutation',
      ],
    },
    {
      isTypeOnly: true,
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/${entityName}Uuid.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Uuid`,
      ],
    },
    {
      moduleSpecifier: `@/modules/${CaseTransformer.toKebabCase(entityName)}/api/services/${CaseTransformer.toKebabCase(entityName)}.service.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Service`,
      ],
    },
  ])

  sourceFile.addInterface({
    name: 'Params',
    properties: [
      {
        name: `${CaseTransformer.toCamelCase(entityName)}Uuid`,
        type: `${CaseTransformer.toPascalCase(entityName)}Uuid`,
      },
    ],
  })
  sourceFile.addFunction({
    isExported: true,
    name: `use${CaseTransformer.toPascalCase(entityName)}DeleteMutation`,
    parameters: [],
    returnType: `UseMutationReturnType<void, void, Params>`,
    statements: [
      `return useMutation<void, void, Params>({
        queryFn: async ({ params }) => {
          await ${CaseTransformer.toPascalCase(entityName)}Service.delete(params.${CaseTransformer.toCamelCase(entityName)}Uuid)
        },
        queryKeysToInvalidate: {
          ${CaseTransformer.toKebabCase(entityName)}Index: {},
        },
      })`,
    ],
  })

  sourceFile.saveSync()
}

async function addToServiceFile(entityName: string) {
  const {
    name, path,
  } = getCreateCrudServiceFile(entityName)

  const serviceSourceFile = await getTsSourceFile({
    filePath: `${path}/${name}`,
    projectPath: BASE_PATH,
  })

  const existingMethod = serviceSourceFile.getClassOrThrow(`${CaseTransformer.toPascalCase(entityName)}Service`).getMethod('delete')

  if (existingMethod) {
    return
  }

  serviceSourceFile.addImportDeclarations([
    {
      isTypeOnly: true,
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/${entityName}Uuid.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}Uuid`,
      ],
    },
  ])

  serviceSourceFile.getClassOrThrow(`${CaseTransformer.toPascalCase(entityName)}Service`)
    .addMethod({
      isAsync: true,
      isStatic: true,
      name: `delete`,
      leadingTrivia: `// TODO Implement the logic to delete a ${CaseTransformer.toPascalCase(entityName)} item.`,
      parameters: [
        {
          name: `${CaseTransformer.toCamelCase(entityName)}Uuid`,
          type: `${CaseTransformer.toPascalCase(entityName)}Uuid`,
        },
      ],
      returnType: `Promise<void>`,
      statements: [],
    })

  serviceSourceFile.saveSync()
}
