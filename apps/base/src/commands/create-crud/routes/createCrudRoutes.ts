import {
  SyntaxKind,
  VariableDeclarationKind,
} from 'ts-morph'

import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

import { getCreateCrudRoutesFile } from './createCrudRoutes.files'

type RouteOption = 'create' | 'delete' | 'detail' | 'index' | 'update'
interface CreateCrudRoutesOptions {
  entityName: string
  routes: RouteOption[]
}

function getRoutePath({
  entityName, route,
}: {
  entityName: string
  route: RouteOption
}): string {
  switch (route) {
    case 'index': {
      return ''
    }
    case 'detail': {
      return `:${entityName}Uuid`
    }
    case 'delete': {
      return `:${entityName}Uuid/delete`
    }
    case 'update': {
      return `:${entityName}Uuid/update`
    }
    case 'create': {
      return `create`
    }
  }
}

function toRoute({
  entityName, route,
}: {
  entityName: string
  route: RouteOption
}) {
  return `{
    name: '${CaseTransformer.toKebabCase(entityName)}-${route}',
    path: '${getRoutePath({
      entityName,
      route,
    })}',
    component: (): Promise<Component> => import('@/modules/${CaseTransformer.toKebabCase(entityName)}/features/${route}/views/${CaseTransformer.toPascalCase(entityName)}${CaseTransformer.toPascalCase(route)}View.vue'),
  }`
}

export async function createCrudRoutes({
  entityName, routes,
}: CreateCrudRoutesOptions) {
  const {
    name, path,
  } = getCreateCrudRoutesFile(entityName)

  const filteredRoutes = routes.filter((route) => route !== 'delete')

  const sourceFileResponse = await tryCatch(createEmptyFile({
    name,
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

  sourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'vue',
    namedImports: [
      'Component',
    ],
  })

  sourceFile.addImportDeclaration({
    isTypeOnly: true,
    moduleSpecifier: 'vue-router',
    namedImports: [
      'RouteRecordRaw',
    ],
  })

  sourceFile.addVariableStatement({
    isExported: true,
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: `${entityName}Routes`,
        initializer: `[
          {
            path: '/${CaseTransformer.toKebabCase(toPlural(entityName))}',
            children: [
              ${filteredRoutes.map((route) => toRoute({
                entityName,
                route,
              }))}
            ],
          }
        ] as const satisfies RouteRecordRaw[]`,
      },
    ],
  })

  await sourceFile.save()
  await addToRoutesIndex({
    entityName: `${entityName}`,
  })
}

async function addToRoutesIndex({
  entityName,
}: { entityName: string }) {
  const routesSourceFile = await getTsSourceFile({
    filePath: `./src/routes/routes.ts`,
    projectPath: BASE_PATH,
  })

  routesSourceFile.addImportDeclaration({
    moduleSpecifier: `@/modules/${CaseTransformer.toKebabCase(entityName)}/routes/${CaseTransformer.toKebabCase(entityName)}.routes.ts`,
    namedImports: [
      `${entityName}Routes`,
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
      return element.getText() === `...${entityName}Routes`
    })

  if (existingRoute) {
    return
  }

  routesArray.addElement(`...${entityName}Routes,`)

  routesSourceFile.saveSync()
}
