import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

import { getCreateCrudUpdateApiMutationFile } from './createCrudUpdate.files'

interface CreateCrudUpdateApiMutationOptions {
  entityName: string
}
export async function createCrudUpdateApiMutation({
  entityName,
}: CreateCrudUpdateApiMutationOptions) {
  await addToServiceFile(entityName)
  await createMutationFile(entityName)
}

async function createMutationFile(entityName: string) {
  const {
    name, path,
  } = getCreateCrudUpdateApiMutationFile(entityName)
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
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/update/${entityName}UpdateForm.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}UpdateForm`,
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
        name: `${CaseTransformer.toKebabCase(entityName)}Uuid`,
        type: `${CaseTransformer.toPascalCase(entityName)}Uuid`,
      },
    ],
  })

  sourceFile.addFunction({
    isExported: true,
    name: `use${CaseTransformer.toPascalCase(entityName)}UpdateMutation`,
    parameters: [],
    returnType: `UseMutationReturnType<${CaseTransformer.toPascalCase(entityName)}UpdateForm, void, Params>`,
    statements: [
      `return useMutation<${CaseTransformer.toPascalCase(entityName)}UpdateForm, void, Params>({
        queryFn: async ({ body, params }) => {
          await ${CaseTransformer.toPascalCase(entityName)}Service.update(params.${CaseTransformer.toKebabCase(entityName)}Uuid, body)
        },
        queryKeysToInvalidate: {
          ${CaseTransformer.toKebabCase(entityName)}Detail: {
            ${CaseTransformer.toKebabCase(entityName)}Uuid: (params) => params.${CaseTransformer.toKebabCase(entityName)}Uuid,
          },
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

  if (serviceSourceFile.getClassOrThrow(`${CaseTransformer.toPascalCase(entityName)}Service`)
    .getMethod('update')) {
    return
  }

  serviceSourceFile.addImportDeclarations([
    {
      isTypeOnly: true,
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/update/${entityName}UpdateForm.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}UpdateForm`,
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
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/update/${entityName}Update.transformer.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}UpdateTransformer`,
      ],
    },
  ])

  serviceSourceFile.getClassOrThrow(`${CaseTransformer.toPascalCase(entityName)}Service`)
    .addMethod({
      isAsync: true,
      isStatic: true,
      name: `update`,
      leadingTrivia: `// TODO Implement the logic to update an existing ${CaseTransformer.toPascalCase(entityName)} item.`,
      parameters: [
        {
          name: `${entityName}Uuid`,
          type: `${CaseTransformer.toPascalCase(entityName)}Uuid`,
        },
        {
          name: 'form',
          type: `${CaseTransformer.toPascalCase(entityName)}UpdateForm`,
        },
      ],
      returnType: `Promise<void>`,
      statements: [],
    })

  serviceSourceFile.saveSync()
}
