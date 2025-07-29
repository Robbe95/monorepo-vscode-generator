import type { SourceFile } from 'ts-morph'

import { getLogger } from '#utils/logger/logger.utils.ts'

export interface ManipulateFunctionOptions {
  isExported?: boolean
  name: string
  comment?: string
  file: SourceFile
  parameters?: {
    isOptional?: boolean
    name: string
    type: string
  }[]
  returnType?: string
  statements: string[]
}

export function manipulateFunction({
  isExported = false,
  name,
  comment,
  file,
  parameters = [],
  returnType,
  statements,
}: ManipulateFunctionOptions) {
  const existingFunction = file.getFunction(name)

  if (existingFunction) {
    getLogger().info(`Function ${name} already exists in file ${file.getBaseName()}, skipping...`)

    return file
  }

  file.addFunction({
    isExported,
    name,
    leadingTrivia: comment,
    parameters: parameters.map((param) => ({
      hasQuestionToken: param.isOptional,
      name: param.name,
      type: param.type,
    })),
    returnType,
    statements,
  })

  return file
}
