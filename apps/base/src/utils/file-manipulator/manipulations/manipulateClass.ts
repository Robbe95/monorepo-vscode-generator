import type { SourceFile } from 'ts-morph'

import { getLogger } from '#utils/logger/logger.utils.ts'

export interface ManipulateClassOptions {
  isExported?: boolean
  name: string
  comment?: string
  file: SourceFile

}

export function manipulateClass({
  name,
  comment,
  file,
}: ManipulateClassOptions) {
  const exitingClass = file.getClass(name)

  if (exitingClass) {
    getLogger().info(`Class ${name} in file ${file.getBaseName()}, skipping...`)

    return file
  }

  file.addClass({
    isExported: true,
    name,
    leadingTrivia: comment,

  })

  return file
}
