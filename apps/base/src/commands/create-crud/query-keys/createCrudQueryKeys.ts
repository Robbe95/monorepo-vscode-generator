import type {
  InterfaceDeclaration,
  SourceFile,
} from 'ts-morph'

import { getConfig } from '#config/getConfig.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

type KeyOption = 'index' | 'update'
interface CreateCrudQueryKeysOptions {
  entityName: EntityCasing
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
  entityName: EntityCasing,
  keys: KeyOption[],
  sourceFile: SourceFile,
) {
  if (!keys.includes('index')) {
    return
  }

  const existingKey = projectKeys.getProperty(`${entityName.camelCase}Index`)

  if (existingKey) {
    return
  }

  sourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: `@/models/${entityName.kebabCase}/index/${entityName.camelCase}IndexQueryOptions.model.ts`,
    namedImports: [
      `${entityName.pascalCase}IndexQueryOptions`,
    ],
  })

  projectKeys
    .addProperty({
      name: `${entityName.camelCase}Index`,
      type: `{ paginationOptions?: ComputedRef<PaginationOptions<${entityName.pascalCase}IndexQueryOptions>> }`,
    })
}

function addUpdateQueryKey(
  projectKeys: InterfaceDeclaration,
  entityName: EntityCasing,
  keys: KeyOption[],
  sourceFile: SourceFile,
) {
  if (!keys.includes('update')) {
    return
  }

  const existingKey = projectKeys.getProperty(`${entityName.camelCase}Update`)

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
    moduleSpecifier: `@/models/${entityName.kebabCase}/${entityName.camelCase}Uuid.model.ts`,
    namedImports: [
      `${entityName.pascalCase}Uuid`,
    ],
  })

  projectKeys
    .addProperty({
      name: `${entityName.camelCase}Detail`,
      type: `{ ${entityName.camelCase}Uuid: ComputedRef<${entityName.pascalCase}Uuid> }`,
    })
}
