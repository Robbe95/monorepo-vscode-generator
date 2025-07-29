import type { SourceFile } from 'ts-morph'

import { getLogger } from '#utils/logger/logger.utils.ts'

export interface ManipulateClassMethodOptions {
  isAsync?: boolean
  isStatic?: boolean
  name: string
  comment?: string
  file: SourceFile
  nameClass: string
  parameters?: {
    isOptional?: boolean
    name: string
    type: string
  }[]
  returnType?: string
  statements: string[]

}

export function manipulateClassMethod({
  isAsync = false,
  isStatic = false,
  name,
  comment,
  file,
  nameClass,
  parameters = [],
  returnType,
  statements,
}: ManipulateClassMethodOptions) {
  let exitingClass = file.getClass(nameClass)

  if (!exitingClass) {
    exitingClass = file.addClass({
      name: nameClass,
    })
  }

  const existingMethod = exitingClass.getMethod(name)

  if (existingMethod) {
    getLogger().info(`Method ${name} already exists in class ${nameClass} in file ${file.getBaseName()}, skipping...`)

    return file
  }

  exitingClass.addMethod({
    isAsync,
    isStatic,
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
