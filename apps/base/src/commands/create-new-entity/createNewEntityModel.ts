import { VariableDeclarationKind } from 'ts-morph'

import { MODELS_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

function getModelFolderPath(entityName: string) {
  return `${CaseTransformer.toKebabCase(entityName)}`
}

function getModelFileName(entityName: string) {
  return `${entityName}.model.ts`
}

function getModelIndexFileName(entityName: string) {
  return `${entityName}.index.ts`
}

function getModelTransformerFileName(entityName: string) {
  return `${entityName}.transformer.ts`
}

export function getModelIndexName(entityName: string) {
  return `client${CaseTransformer.toPascalCase(entityName)}Index`
}

export function getModelDetailName(entityName: string) {
  return `client${CaseTransformer.toPascalCase(entityName)}Detail`
}

async function getModelFullModelFolderPath(entityName: string) {
  return `${await getRootFolder()}/${MODELS_PATH}/src/${getModelFolderPath(entityName)}`
}

export async function createNewEntityModel(entityName: string) {
  await createModelFile(entityName)
  await createModelTransformerFile(entityName)
  await createModelIndexFile(entityName)
  await addToModelIndexFile(entityName)
}

export async function createModelFile(entityName: string) {
  const modelFolderPath = await getModelFullModelFolderPath(entityName)

  await createEmptyFile({
    name: getModelFileName(entityName),
    projectPath: MODELS_PATH,
    path: `${modelFolderPath}`,
  })

  const modelSourceFile = await getTsSourceFile({
    filePath: `src/${getModelFolderPath(entityName)}/${getModelFileName(entityName)}`,
    projectPath: MODELS_PATH,
  })

  const INDEX_NAME = getModelIndexName(entityName)
  const DETAIL_NAME = getModelDetailName(entityName)

  modelSourceFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: [
      'z',
    ],
  })

  modelSourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${INDEX_NAME}Schema`,
        initializer: `z.object({
          id: z.string(),
          title: z.string(),
        })`,
      },
    ],
    leadingTrivia: `// TODO: This file was generated. Add your ${entityName} INDEX model here`,
  })

  modelSourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${DETAIL_NAME}Schema`,
        initializer: `z.object({
          id: z.string(),
          title: z.string(),
        })`,
      },
    ],
    leadingTrivia: `// TODO: This file was generated. Add your ${entityName} DETAIL model here`,
  })

  modelSourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${INDEX_NAME}FilterSchema`,
        initializer: `z.object({})`,
      },
    ],
    leadingTrivia: `// TODO: This file was generated. Add your ${entityName} INDEX FILTER model here`,
  })

  modelSourceFile.addTypeAlias({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(INDEX_NAME)}`,
    type: `z.infer<typeof ${INDEX_NAME}Schema>`,
  })

  modelSourceFile.addTypeAlias({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(DETAIL_NAME)}`,
    type: `z.infer<typeof ${DETAIL_NAME}Schema>`,
  })

  modelSourceFile.addTypeAlias({
    isExported: true,
    name: `${CaseTransformer.toPascalCase(INDEX_NAME)}Filter`,
    type: `z.infer<typeof ${INDEX_NAME}FilterSchema>`,
  })

  modelSourceFile.saveSync()
}

export async function createModelTransformerFile(entityName: string) {
  const modelFolderPath = await getModelFullModelFolderPath(entityName)

  await createEmptyFile({
    name: getModelTransformerFileName(entityName),
    projectPath: MODELS_PATH,
    path: `${modelFolderPath}`,
  })

  const modelTransformerSourceFile = await getTsSourceFile({
    filePath: `src/${getModelFolderPath(entityName)}/${getModelTransformerFileName(entityName)}`,
    projectPath: MODELS_PATH,
  })

  const INDEX_NAME = getModelIndexName(entityName)
  const DETAIL_NAME = getModelDetailName(entityName)

  modelTransformerSourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@repo/payload-types',
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}`,
    ],
  })
  modelTransformerSourceFile.addImportDeclaration({
    moduleSpecifier: 'zod',
    namedImports: [
      'z',
    ],
  })
  modelTransformerSourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `#${getModelFolderPath(entityName)}/${getModelFileName(entityName)}`,
    namedImports: [
      `${CaseTransformer.toPascalCase(INDEX_NAME)}`,
      `${CaseTransformer.toPascalCase(DETAIL_NAME)}`,
    ],
  })
  modelTransformerSourceFile.addImportDeclaration({
    moduleSpecifier: `#${getModelFolderPath(entityName)}/${getModelFileName(entityName)}`,
    namedImports: [
      `${INDEX_NAME}Schema`,
      `${DETAIL_NAME}Schema`,
    ],
  })

  modelTransformerSourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${CaseTransformer.toPascalCase(entityName)}Transformer`,
        initializer: `{
          to${CaseTransformer.toPascalCase(INDEX_NAME)}(data: ${CaseTransformer.toPascalCase(entityName)}): ${CaseTransformer.toPascalCase(INDEX_NAME)} {
            const ${INDEX_NAME}: ${CaseTransformer.toPascalCase(INDEX_NAME)} = {
              id: data.id,
              title: data.title,
            }
            return ${INDEX_NAME}Schema.parse(${INDEX_NAME})
          },
          to${CaseTransformer.toPascalCase(DETAIL_NAME)}(data: ${CaseTransformer.toPascalCase(entityName)}): ${CaseTransformer.toPascalCase(DETAIL_NAME)} {
            const ${DETAIL_NAME}: ${CaseTransformer.toPascalCase(DETAIL_NAME)} = {
              id: data.id,
              title: data.title,
            }
            return ${DETAIL_NAME}Schema.parse(${DETAIL_NAME})
          },
        }`,
      },
    ],
    leadingTrivia: `// TODO: This file was generated. Add your ${entityName} transformer here`,
  })

  modelTransformerSourceFile.saveSync()
}

export async function createModelIndexFile(entityName: string) {
  const modelFolderPath = await getModelFullModelFolderPath(entityName)

  await createEmptyFile({
    name: getModelIndexFileName(entityName),
    projectPath: MODELS_PATH,
    path: `${modelFolderPath}`,
  })

  const modelIndexSourceFile = await getTsSourceFile({
    filePath: `src/${getModelFolderPath(entityName)}/${getModelIndexFileName(entityName)}`,
    projectPath: MODELS_PATH,
  })

  modelIndexSourceFile.addExportDeclaration({
    moduleSpecifier: `#${getModelFolderPath(entityName)}/${getModelFileName(entityName)}`,
  })

  modelIndexSourceFile.addExportDeclaration({
    moduleSpecifier: `#${getModelFolderPath(entityName)}/${getModelTransformerFileName(entityName)}`,
  })

  modelIndexSourceFile.saveSync()
}

export async function addToModelIndexFile(entityName: string) {
  const globalModalIndexSourceFile = await getTsSourceFile({
    filePath: `src/index.ts`,
    projectPath: MODELS_PATH,
  })

  globalModalIndexSourceFile.addExportDeclaration({
    moduleSpecifier: `#${getModelFolderPath(entityName)}/${getModelIndexFileName(entityName)}`,
  })

  globalModalIndexSourceFile.saveSync()
}
