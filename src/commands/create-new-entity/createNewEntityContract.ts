import {
  SyntaxKind,
  VariableDeclarationKind,
} from 'ts-morph'

import { CONTRACT_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/entityCasing.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

import {
  getModelDetailName,
  getModelIndexName,
} from './createNewEntityModel'

function getContractFolderPath(entityName: string) {
  return `contracts/${CaseTransformer.toKebabCase(entityName)}`
}

function getContractFileName(entityName: string) {
  return `${entityName}.contract.ts`
}

export function getContractIndexName(entityName: string) {
  return `get${CaseTransformer.toPascalCase(entityName)}Index`
}

export function getContractDetailName(entityName: string) {
  return `get${CaseTransformer.toPascalCase(entityName)}Detail`
}
// TODO: add post / update / delete contracts?

export function createNewEntityContract(entityName: string) {
  createContractFile(entityName)
  addToContractIndexFile(entityName)
}

export function createContractFile(entityName: string) {
  const rootFolder = getRootFolder()
  const basePath = `${rootFolder}/${CONTRACT_PATH}/src`
  const contractFolderPath = `${basePath}/${getContractFolderPath(entityName)}`

  createEmptyFile({
    name: getContractFileName(entityName),
    projectPath: CONTRACT_PATH,
    path: `${contractFolderPath}`,
  })

  const contractSourceFile = getTsSourceFile({
    filePath: `src/${getContractFolderPath(entityName)}/${getContractFileName(entityName)}`,
    projectPath: CONTRACT_PATH,
  })

  const INDEX_NAME = getContractIndexName(entityName)
  const DETAIL_NAME = getContractDetailName(entityName)

  contractSourceFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: [
      'z',
    ],
  })

  contractSourceFile.addImportDeclaration({
    moduleSpecifier: '@repo/models',
    namedImports: [
      'getPaginatedSchema',
      'paginationInputSchema',
      `${getModelIndexName(entityName)}FilterSchema`,
      `${getModelIndexName(entityName)}Schema`,
      `${getModelDetailName(entityName)}Schema`,
    ],
  })

  contractSourceFile.addImportDeclaration({
    moduleSpecifier: '#errors/errors.ts',
    namedImports: [
      'ERROR_NOT_FOUND',
    ],
  })

  contractSourceFile.addImportDeclaration({
    moduleSpecifier: '#procedures/procedures.ts',
    namedImports: [
      'publicProcedure',
    ],
  })

  contractSourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${INDEX_NAME}`,
        initializer: `publicProcedure
          .input(z.object({
            pagination: paginationInputSchema,
            filter: ${getModelIndexName(entityName)}FilterSchema
          }))
          .output(getPaginatedSchema(${getModelIndexName(entityName)}Schema))`,
      },
    ],
    leadingTrivia: `// TODO: This file was generated. Add your ${entityName} INDEX contract here`,
  })

  contractSourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${DETAIL_NAME}`,
        initializer: `publicProcedure
          .input(z.object({
            id: z.string(),
          }))
          .output(${getModelDetailName(entityName)}Schema)
          .errors({
            ERROR_NOT_FOUND,
          })`,
      },
    ],
    leadingTrivia: `// TODO: This file was generated. Add your ${entityName} DETAIL model here`,
  })

  contractSourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${CaseTransformer.toUpperCase(entityName)}_CONTRACT`,
        initializer: `{
          ${INDEX_NAME},
          ${DETAIL_NAME},
        }`,
      },
    ],
  })

  contractSourceFile.saveSync()
}

export function addToContractIndexFile(entityName: string) {
  const globalContractIndexSourceFile = getTsSourceFile({
    filePath: `src/contract.ts`,
    projectPath: CONTRACT_PATH,
  })

  globalContractIndexSourceFile.addImportDeclaration({
    moduleSpecifier: `#${getContractFolderPath(entityName)}/${getContractFileName(entityName)}`,
    namedImports: [
      `${CaseTransformer.toUpperCase(entityName)}_CONTRACT`,
    ],
  })

  globalContractIndexSourceFile.getVariableDeclarationOrThrow('ORPC_CONTRACT')
    .getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    .addPropertyAssignment({
      name: `${entityName}`,
      initializer: `${CaseTransformer.toUpperCase(entityName)}_CONTRACT`,
    })

  globalContractIndexSourceFile.saveSync()
}
