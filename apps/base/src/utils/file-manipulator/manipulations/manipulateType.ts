import type { SourceFile } from 'ts-morph'

import { getLogger } from '#utils/logger/logger.utils.ts'

export interface ManipulateType {
  isExported?: boolean
  name: string
  comment?: string
  file: SourceFile
  type: string
}

export function manipulateType({
  isExported = false,
  name,
  comment,
  file,
  type,
}: ManipulateType) {
  const existingType = file.getTypeAlias(name)

  if (existingType) {
    getLogger().info(`Type ${name} already exists in file ${file.getBaseName()}, skipping...`)

    return file
  }

  file.addTypeAlias({
    isExported,
    name,
    leadingTrivia: comment,
    type,
  })

  return file
}
