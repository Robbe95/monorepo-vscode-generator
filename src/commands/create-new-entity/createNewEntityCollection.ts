import {
  SyntaxKind,
  VariableDeclarationKind,
} from 'ts-morph'

import { PAYLOAD_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/entityCasing.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

export function getCollectionsFolderPath(entityName: string) {
  return `${PAYLOAD_PATH}/src/collections/${CaseTransformer.toKebabCase(toPlural(entityName))}`
}

function getCollectionFolderPath(entityName: string) {
  return `${getCollectionsFolderPath(entityName)}/${CaseTransformer.toKebabCase(entityName)}`
}

function getCollectionsFileName(entityName: string) {
  return `${entityName}.collections.ts`
}

function getCollectionFileName(entityName: string) {
  return `${entityName}.collection.ts`
}

export function createNewEntityCollection(entityName: string) {
  createCollectionFile(entityName)
  createCollectionsFile(entityName)
  addCollectionToIndexFile(entityName)
}

export function createCollectionFile(entityName: string) {
  const collectionFolderPath = `${getRootFolder()}/${getCollectionFolderPath(entityName)}`

  createEmptyFile({
    name: getCollectionFileName(entityName),
    projectPath: PAYLOAD_PATH,
    path: collectionFolderPath,
  })

  const collectionSourceFile = getTsSourceFile({
    filePath: `${getCollectionFolderPath(entityName)}/${getCollectionFileName(entityName)}`,
    projectPath: PAYLOAD_PATH,
  })

  collectionSourceFile.addImportDeclaration({
    moduleSpecifier: 'payload',
    namedImports: [
      'CollectionConfig',
    ],
  })
  collectionSourceFile.addImportDeclaration({
    moduleSpecifier: '@payload/hooks/toUuid.hook',
    namedImports: [
      'toUuidHook',
    ],
  })
  collectionSourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${entityName}Collection`,
        initializer: `{
        access: {
          read: () => true,
        },
        admin: {
          useAsTitle: 'title',
        },
        fields: [
          {
            name: 'id',
            admin: {
              hidden: true,
            },
            index: true,
            required: true,
            type: 'text',
            unique: true,
          },
          {
            name: 'title',
            localized: true,
            required: true,
            type: 'text',
          },
        ],
        hooks: {
          beforeChange: [
            toUuidHook,
          ],
        },
        slug: '${toPlural(entityName)}',
      }`,
        type: 'CollectionConfig',
      },
    ],
    leadingTrivia: [
      `// TODO: This file was generated. Add your ${entityName} collection config here`,
    ],
  })
  collectionSourceFile.saveSync()
}

export function createCollectionsFile(entityName: string) {
  const collectionPath = `${getRootFolder()}/${getCollectionsFolderPath(entityName)}`

  createEmptyFile({
    name: getCollectionsFileName(entityName),
    projectPath: PAYLOAD_PATH,
    path: collectionPath,
  })

  const collectionsSourceFile = getTsSourceFile({
    filePath: `${getCollectionsFolderPath(entityName)}/${getCollectionsFileName(entityName)}`,
    projectPath: PAYLOAD_PATH,
  })

  collectionsSourceFile.addImportDeclaration({
    moduleSpecifier: `@payload/collections/${CaseTransformer.toKebabCase(toPlural(entityName))}/${CaseTransformer.toKebabCase(entityName)}/${getCollectionFileName(entityName)}`,
    namedImports: [
      `${entityName}Collection`,
    ],
  })
  collectionsSourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'payload',
    namedImports: [
      'CollectionConfig',
    ],
  })
  collectionsSourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${entityName}Collections`,
        initializer: `[
        ${entityName}Collection,
      ]`,
        type: 'CollectionConfig[]',
      },
    ],
  })
  collectionsSourceFile.saveSync()
}

export function addCollectionToIndexFile(entityName: string) {
  const collectionsSourceFile = getTsSourceFile({
    filePath: `src/collections/collections.ts`,
    projectPath: PAYLOAD_PATH,
  })

  collectionsSourceFile.addImportDeclaration({
    moduleSpecifier: `@payload/collections/${CaseTransformer.toKebabCase(toPlural(entityName))}/${getCollectionsFileName(entityName)}`,
    namedImports: [
      `${entityName}Collections`,
    ],
  })

  collectionsSourceFile
    .getVariableDeclarationOrThrow('collections')
    .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression)
    .addElement(`...${entityName}Collections`)

  collectionsSourceFile.saveSync()
}
