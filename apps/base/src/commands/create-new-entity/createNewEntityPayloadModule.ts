import {
  SyntaxKind,
  VariableDeclarationKind,
} from 'ts-morph'

import { PAYLOAD_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { createFolder } from '#utils/folders/createFolder.utils.ts'
import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

import {
  getContractDetailName,
  getContractIndexName,
} from './createNewEntityContract'

function getRouterFileName(moduleName: string) {
  return `${moduleName}.router.ts`
}

function getIndexQueryFileName(entityName: string) {
  return `${getContractIndexName(entityName)}.serverQuery.ts`
}

function getDetailQueryFileName(entityName: string) {
  return `${getContractDetailName(entityName)}.serverQuery.ts`
}

function getModuleFolderPath(entityName: string) {
  return `src/modules/${CaseTransformer.toKebabCase(entityName)}`
}

async function getModuleFolderFullPath(entityName: string) {
  return `${await getRootFolder()}/${PAYLOAD_PATH}/${getModuleFolderPath(entityName)}`
}

export async function createNewEntityPayloadModule(entityName: string) {
  createFolder(await getModuleFolderFullPath(entityName))

  await createRouterFile(entityName)
  await createIndexQueryFile(entityName)
  await createDetailQueryFile(entityName)
  await addToOrpcRouterFile(entityName)
}

async function getPayloadModulePath(entityName: string) {
  return `${await getRootFolder()}/${PAYLOAD_PATH}/${getModuleFolderPath(entityName)}`
}

async function createRouterFile(entityName: string) {
  const payloadModulePath = `${await getModuleFolderFullPath(entityName)}`

  await createEmptyFile({
    name: getRouterFileName(entityName),
    projectPath: PAYLOAD_PATH,
    path: `${payloadModulePath}`,
  })

  const routerSourceFile = await getTsSourceFile({
    filePath: `${getModuleFolderPath(entityName)}/${getRouterFileName(entityName)}`,
    projectPath: PAYLOAD_PATH,
  })

  routerSourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@payload/orpc/router/orpc.router',
    namedImports: [
      'OrpcRouter',
    ],
  })

  routerSourceFile.addImportDeclaration({
    moduleSpecifier: `@payload/modules/${CaseTransformer.toKebabCase(entityName)}/query/${getIndexQueryFileName(entityName)}`,
    namedImports: [
      `${getContractIndexName(entityName)}`,
    ],
  })

  routerSourceFile.addImportDeclaration({
    moduleSpecifier: `@payload/modules/${CaseTransformer.toKebabCase(entityName)}/query/${getDetailQueryFileName(entityName)}`,
    namedImports: [
      `${getContractDetailName(entityName)}`,
    ],
  })

  routerSourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${entityName}Router`,
        initializer: `{
          ${getContractIndexName(entityName)},
          ${getContractDetailName(entityName)},
        }`,
        type: `OrpcRouter['${entityName}']`,
      },
    ],
  })

  routerSourceFile.saveSync()
}

async function createIndexQueryFile(entityName: string) {
  const queryPath = `${await getPayloadModulePath(entityName)}/query`

  await createEmptyFile({
    name: getIndexQueryFileName(entityName),
    projectPath: PAYLOAD_PATH,
    path: `${queryPath}`,
  })

  const indexQuerySourceFile = await getTsSourceFile({
    filePath: `${getModuleFolderPath(entityName)}/query/${getIndexQueryFileName(entityName)}`,
    projectPath: PAYLOAD_PATH,
  })

  indexQuerySourceFile.addImportDeclaration({
    moduleSpecifier: '@payload/orpc/procedures/public.procedure',
    namedImports: [
      'publicProcedure',
    ],
  })

  indexQuerySourceFile.addImportDeclaration({
    moduleSpecifier: '@payload/utils/payload/getPayload.util',
    namedImports: [
      'getPayload',
    ],
  })

  indexQuerySourceFile.addImportDeclaration({
    moduleSpecifier: '@repo/models',
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}Transformer`,
      `PaginationTransformer`,
    ],
  })

  indexQuerySourceFile.addImportDeclaration({
    moduleSpecifier: `@payload/modules/${CaseTransformer.toKebabCase(entityName)}/models/${getContractIndexName(entityName)}`,
    namedImports: [
      `${getContractIndexName(entityName)}Schema`,
    ],
  })

  indexQuerySourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${getContractIndexName(entityName)}`,
        initializer: `publicProcedure.${entityName}.${getContractIndexName(entityName)}
          .handler(async ({
            context, input,
          }) => {
            const payload = await getPayload()
            // TODO: Implement filter here
            const {
              pagination,
            } = input

            const page = Math.floor(pagination.skip / pagination.take) + 1

            const payload${CaseTransformer.toPascalCase(entityName)}Response = await payload.find({
              collection: '${toPlural(entityName)}',
              locale: context.locale,
              limit: pagination.take,
              page,
              // TODO: Implement filter with where query
            })
            const parsed${CaseTransformer.toPascalCase(toPlural(entityName))} = payload${CaseTransformer.toPascalCase(entityName)}Response.docs
              .map((${entityName}) => ${CaseTransformer.toPascalCase(entityName)}Transformer.toClient${CaseTransformer.toPascalCase(entityName)}Index(${entityName}))
              
            return PaginationTransformer.toPaginationOutput({
              data: parsed${CaseTransformer.toPascalCase(toPlural(entityName))},
              pagination: payload${CaseTransformer.toPascalCase(entityName)}Response,
            })

        })`,
      },
    ],
  })

  indexQuerySourceFile.saveSync()
}

async function createDetailQueryFile(entityName: string) {
  const queryPath = `${await getPayloadModulePath(entityName)}/query`

  await createEmptyFile({
    name: getDetailQueryFileName(entityName),
    projectPath: PAYLOAD_PATH,
    path: `${queryPath}`,
  })

  const indexQuerySourceFile = await getTsSourceFile({
    filePath: `${getModuleFolderPath(entityName)}/query/${getDetailQueryFileName(entityName)}`,
    projectPath: PAYLOAD_PATH,
  })

  indexQuerySourceFile.addImportDeclaration({
    moduleSpecifier: '@payload/orpc/procedures/public.procedure',
    namedImports: [
      'publicProcedure',
    ],
  })

  indexQuerySourceFile.addImportDeclaration({
    moduleSpecifier: '@payload/utils/payload/getPayload.util',
    namedImports: [
      'getPayload',
    ],
  })

  indexQuerySourceFile.addImportDeclaration({
    moduleSpecifier: '@repo/models',
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}Transformer`,
    ],
  })

  indexQuerySourceFile.addImportDeclaration({
    moduleSpecifier: `@payload/modules/${CaseTransformer.toKebabCase(entityName)}/models/${getContractDetailName(entityName)}`,
    namedImports: [
      `${getContractDetailName(entityName)}Schema`,
    ],
  })

  indexQuerySourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${getContractDetailName(entityName)}`,
        initializer: `publicProcedure.${entityName}.${getContractDetailName(entityName)}
          .handler(async ({
            context, input, errors
          }) => {
            const payload = await getPayload()
            const payload${CaseTransformer.toPascalCase(entityName)}Response = await payload.find({
              collection: '${toPlural(entityName)}',
              limit: 1,
              locale: context.locale,
              where: {
                id: {
                  equals: input.id,
                },
              },
            })
            const found${CaseTransformer.toPascalCase(entityName)} = payload${CaseTransformer.toPascalCase(entityName)}Response.docs[0]

            if (found${CaseTransformer.toPascalCase(entityName)} == null) {
              throw errors.ERROR_NOT_FOUND()
            }
              
            return ${CaseTransformer.toPascalCase(entityName)}Transformer.toClient${CaseTransformer.toPascalCase(entityName)}Detail(
              found${CaseTransformer.toPascalCase(entityName)}
            )
        })`,
      },
    ],
  })

  indexQuerySourceFile.saveSync()
}

async function addToOrpcRouterFile(entityName: string) {
  const orpcRouterSourceFile = await getTsSourceFile({
    filePath: `src/orpc/router/orpc.router.ts`,
    projectPath: PAYLOAD_PATH,
  })

  orpcRouterSourceFile.addImportDeclaration({
    moduleSpecifier: `@payload/modules/${CaseTransformer.toKebabCase(entityName)}/${getRouterFileName(entityName)}`,
    namedImports: [
      `${entityName}Router`,
    ],
  })

  orpcRouterSourceFile
    .getVariableDeclarationOrThrow('orpcRouter')
    .getInitializerIfKindOrThrow(SyntaxKind.CallExpression)
    .getArguments()[0]
    .asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    .addPropertyAssignment({
      name: entityName,
      initializer: `${entityName}Router`,
    })

  orpcRouterSourceFile.saveSync()
}
