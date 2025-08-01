import { SyntaxKind } from 'ts-morph'

import { createCrudModuleAddExport } from '#commands/create-crud/module/createCrudModuleAddExport.ts'
import { getConfig } from '#config/getConfig.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

import { getCreateCrudRoutesFile } from './createCrudRoutes.files'

type RouteOption = 'create' | 'delete' | 'detail' | 'index' | 'update'
interface CreateCrudRoutesOptions {
  entityName: EntityCasing

  routes: RouteOption[]
}

function getRoutePath({
  entityName, route,
}: {
  entityName: EntityCasing
  route: RouteOption
}): string {
  switch (route) {
    case 'index': {
      return ''
    }
    case 'detail': {
      return `:${entityName.camelCase}Uuid`
    }
    case 'delete': {
      return `:${entityName.camelCase}Uuid/delete`
    }
    case 'update': {
      return `:${entityName.camelCase}Uuid/update`
    }
    case 'create': {
      return `create`
    }
  }
}

function toRoute({
  entityName, route,
}: {
  entityName: EntityCasing
  route: RouteOption
}) {
  return `{
    name: '${entityName.kebabCase}-${route}',
    path: '${getRoutePath({
      entityName,
      route,
    })}',
    component: (): Promise<Component> => import('@/modules/${entityName.kebabCase}/features/${route}/views/${entityName.pascalCase}${CaseTransformer.toPascalCase(route)}View.vue'),
  }`
}

export async function createCrudRoutes({
  entityName, routes,
}: CreateCrudRoutesOptions) {
  const {
    name, path,
  } = getCreateCrudRoutesFile(entityName)

  const filteredRoutes = routes.filter((route) => route !== 'delete')

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: 'vue',
      namedImports: [
        'Component',
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: 'vue-router',
      namedImports: [
        'RouteRecordRaw',
      ],
    })
    .addVariable({
      isExported: true,
      name: `${entityName.camelCase}Routes`,
      initializer: `[
          {
            path: '/${CaseTransformer.toKebabCase(toPlural(entityName.camelCase))}',
            children: [
              ${filteredRoutes
                .map((route) => toRoute({
                  entityName,
                  route,
                }))}
            ],
          }
        ] as const satisfies RouteRecordRaw[]`,
    })
    .save()

  await addToRoutesIndex({
    entityName,
  })
  addRoutesToModuleExport({
    entityName,
  })
}

async function addToRoutesIndex({
  entityName,
}: { entityName: EntityCasing }) {
  const config = await getConfig()
  const routesSourceFile = await getTsSourceFile({
    filePath: config.routerFileLocation,
    projectPath: BASE_PATH,
  })

  routesSourceFile.addImportDeclaration({
    moduleSpecifier: `@/modules/${entityName.kebabCase}`,
    namedImports: [
      `${entityName.camelCase}Routes`,
    ],
  })

  const routesArray = routesSourceFile
    .getVariableDeclarationOrThrow('routes')
    .asKindOrThrow(SyntaxKind.VariableDeclaration)
    .getInitializerIfKindOrThrow(SyntaxKind.SatisfiesExpression)
    .getExpressionIfKindOrThrow(SyntaxKind.AsExpression)
    .getExpressionIfKindOrThrow(SyntaxKind.ArrayLiteralExpression)
    .getElements()
    .find((element) => {
      const objectLiteral = element.asKindOrThrow(SyntaxKind.ObjectLiteralExpression)

      return objectLiteral.getProperty('meta')?.getText().includes('authMiddleware')
    })
    ?.asKindOrThrow(SyntaxKind.ObjectLiteralExpression)
    .getPropertyOrThrow('children')
    .asKindOrThrow(SyntaxKind.PropertyAssignment)
    .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression)

  if (!routesArray) {
    return
  }

  const existingRoute = routesArray
    .getElements()
    .find((element) => {
      return element.getText() === `...${entityName.camelCase}Routes`
    })

  if (existingRoute) {
    return
  }

  routesArray
    .addElement(`...${entityName.camelCase}Routes,`)

  routesSourceFile.saveSync()
}

function addRoutesToModuleExport({
  entityName,
}: { entityName: EntityCasing }) {
  const routesFile = getCreateCrudRoutesFile(entityName)

  createCrudModuleAddExport({
    entityName,
    moduleSpecifier: toFileAlias(routesFile),
    namedExports: [
      `${entityName.camelCase}Routes`,
    ],
  })
}
