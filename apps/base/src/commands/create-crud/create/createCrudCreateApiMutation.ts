import { getCreateCrudServiceFile } from '#commands/create-crud/service/createCrudService.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

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
  const sourceFileResponse = await tryCatch(createEmptyFile ({
    name,
    projectPath: BASE_PATH,
    path,
  }))

  if (sourceFileResponse.error) {
    skipFile({
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
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/create/${entityName}CreateForm.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}CreateForm`,
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

  sourceFile.addFunction({
    isExported: true,
    name: `use${CaseTransformer.toPascalCase(entityName)}CreateMutation`,
    parameters: [],
    returnType: `UseMutationReturnType<${CaseTransformer.toPascalCase(entityName)}CreateForm, ${CaseTransformer.toPascalCase(entityName)}Uuid>`,
    statements: [
      `return useMutation<${CaseTransformer.toPascalCase(entityName)}CreateForm, ${CaseTransformer.toPascalCase(entityName)}Uuid>({
        queryFn: async ({ body }) => {
          return await ${CaseTransformer.toPascalCase(entityName)}Service.create(body)
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

  serviceSourceFile.addImportDeclarations([
    {
      isTypeOnly: true,
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/create/${entityName}CreateForm.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}CreateForm`,
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
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/create/${entityName}CreateTransformer.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}CreateTransformer`,
      ],
    },
  ])

  serviceSourceFile.getClassOrThrow(`${CaseTransformer.toPascalCase(entityName)}Service`)
    .addMethod({
      isAsync: true,
      isStatic: true,
      name: `create`,
      leadingTrivia: `// TODO Implement the logic to create a new ${CaseTransformer.toPascalCase(entityName)} item.`,
      parameters: [
        {
          name: 'form',
          type: `${CaseTransformer.toPascalCase(entityName)}CreateForm`,
        },
      ],
      returnType: `Promise<${CaseTransformer.toPascalCase(entityName)}Uuid>`,
      statements: [
        `const dto = ${CaseTransformer.toPascalCase(entityName)}CreateTransformer.toDto(form)
        const response = {} as any
        return response.data.uuid as ${CaseTransformer.toPascalCase(entityName)}Uuid`,
      ],
    })

  serviceSourceFile.saveSync()
}
