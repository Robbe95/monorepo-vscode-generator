import type { SourceFile } from 'ts-morph'
import { VariableDeclarationKind } from 'ts-morph'

import { getLogger } from '#utils/logger/logger.utils.ts'

export interface ManipulateVariableOptions {
  isExported?: boolean
  isLet?: boolean
  name: string
  comment?: string
  file: SourceFile
  initializer: string
}

export function manipulateVariable({
  isExported = false,
  isLet = false,
  name,
  comment,
  file,
  initializer,
}: ManipulateVariableOptions) {
  const existingVariable = file.getVariableDeclaration(name)

  if (existingVariable) {
    getLogger().info(`Variable ${name} already exists in file ${file.getBaseName()}, skipping...`)

    return file
  }

  file.addVariableStatement({
    isExported,
    declarationKind: isLet ? VariableDeclarationKind.Let : VariableDeclarationKind.Const,
    declarations: [
      {
        name,
        initializer,
      },
    ],
    leadingTrivia: comment,
  })

  return file
}
