import type {
  InterfaceDeclaration,
  SourceFile,
} from 'ts-morph'

import { getConfig } from '#config/getConfig.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

type KeyOption = 'index' | 'update'
interface CreateCrudQueryKeysOptions {
  entityName: string
  keys: KeyOption[]
}

export async function createCrudQueryKeys({
  entityName, keys,
}: CreateCrudQueryKeysOptions) {
  const config = await getConfig()

  const queryKeysSourceFile = await getTsSourceFile({
    filePath: config.queryFileKeyLocation,
    projectPath: BASE_PATH,
  })
  const projectKeys = queryKeysSourceFile.getInterfaceOrThrow('ProjectQueryKeys')

  addIndexQueryKey(projectKeys, entityName, keys, queryKeysSourceFile)
  addUpdateQueryKey(projectKeys, entityName, keys, queryKeysSourceFile)

  queryKeysSourceFile.saveSync()
}

function addIndexQueryKey(
  projectKeys: InterfaceDeclaration,
  entityName: string,
  keys: KeyOption[],
  sourceFile: SourceFile,
) {
  if (!keys.includes('index')) {
    return
  }

  const existingKey = projectKeys.getProperty(`${CaseTransformer.toCamelCase(entityName)}Index`)

  if (existingKey) {
    return
  }

  sourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/index/${entityName}IndexQueryOptions.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}IndexQueryOptions`,
    ],
  })

  projectKeys
    .addProperty({
      name: `${CaseTransformer.toCamelCase(entityName)}Index`,
      type: `{ paginationOptions?: ComputedRef<PaginationOptions<${CaseTransformer.toPascalCase(entityName)}IndexQueryOptions>> }`,
    })
}

function addUpdateQueryKey(
  projectKeys: InterfaceDeclaration,
  entityName: string,
  keys: KeyOption[],
  sourceFile: SourceFile,
) {
  if (!keys.includes('update')) {
    return
  }

  const existingKey = projectKeys.getProperty(`${CaseTransformer.toCamelCase(entityName)}Update`)

  if (existingKey) {
    return
  }

  sourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'vue',
    namedImports: [
      'ComputedRef',
    ],
  })

  sourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: '@wisemen/vue-core-components',
    namedImports: [
      'PaginationOptions',
    ],
  })

  sourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/${entityName}Uuid.model.ts`,
    namedImports: [
      `${CaseTransformer.toPascalCase(entityName)}Uuid`,
    ],
  })

  projectKeys
    .addProperty({
      name: `${CaseTransformer.toCamelCase(entityName)}Detail`,
      type: `{ ${CaseTransformer.toCamelCase(entityName)}Uuid: ComputedRef<${CaseTransformer.toPascalCase(entityName)}Uuid> }`,
    })
}
