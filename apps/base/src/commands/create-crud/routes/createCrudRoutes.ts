import {
  SyntaxKind,
  VariableDeclarationKind,
} from 'ts-morph'

import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
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
  if (route === 'index') {
    return ''
  }
  if (route === 'detail') {
    return `:${entityName}Uuid`
  }

  return `:${entityName}Uuid/${route}`
}

function toRoute({
  entityName, route,
}: {
  entityName: string
  route: RouteOption
}) {
  return `{
    name: '${entityName}-${route}',
    path: '${getRoutePath({
      entityName,
      route,
    })}',
    component: (): Promise<Component> => import('@/modules/${entityName}/features/${route}/views/${CaseTransformer.toPascalCase(entityName)}${CaseTransformer.toPascalCase(route)}View.vue'),
  }`
}

export async function createCrudRoutes({
  entityName, routes,
}: CreateCrudRoutesOptions) {
  const {
    name, path,
  } = getCreateCrudRoutesFile(entityName)

  const sourceFile = await createEmptyFile({
    name,
    path,
  })

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
            path: '/${toPlural(entityName)}',
            children: [
              ${routes.map((route) => toRoute({
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
    filePath: `src/routes/routes.ts`,
    projectPath: BASE_PATH,
  })

  routesSourceFile.addImportDeclaration({
    moduleSpecifier: `@/modules/${CaseTransformer.toKebabCase(entityName)}/routes/${CaseTransformer.toKebabCase(entityName)}.routes.ts`,
    namedImports: [
      `${entityName}Routes`,
    ],
  })

  routesSourceFile
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
    .addElement(`...${entityName}Routes,`)

  routesSourceFile.saveSync()
}
