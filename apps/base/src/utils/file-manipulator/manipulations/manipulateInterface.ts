import type { SourceFile } from 'ts-morph'

import { getLogger } from '#utils/logger/logger.utils.ts'

export interface ManipulateInterfaceOptions {
  name: string
  comment?: string
  file: SourceFile
  properties: {
    name: string
    type: string
  }[]
}

export function manipulateInterface({
  name,
  comment,
  file,
  properties,
}: ManipulateInterfaceOptions) {
  const existingInterface = file.getInterface(name)

  if (existingInterface) {
    getLogger().info(`Interface ${name} already exists in file ${file.getBaseName()}, skipping...`)

    return file
  }

  file.addInterface({
    name,
    leadingTrivia: comment,
    properties,
  })

  return file
}
