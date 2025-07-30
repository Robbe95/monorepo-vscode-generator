import type { SourceFile } from 'ts-morph'

import { getLogger } from '#utils/logger/logger.utils.ts'

export { getLogger } from '#utils/logger/logger.utils.ts'

export interface ManipulateExportOptions {
  isTypeOnly?: boolean
  file: SourceFile
  moduleSpecifier: string
  namedExports: string[]
}

export function manipulateExport({
  isTypeOnly,
  file,
  moduleSpecifier,
  namedExports,
}: ManipulateExportOptions) {
  // check if the export already exists and if the named exports are already present
  const existingExport = file.getExportDeclaration(moduleSpecifier)
  const isTypeIsMatching = existingExport?.isTypeOnly() === isTypeOnly

  if (existingExport && isTypeIsMatching) {
    const existingNamedExports = new Set(existingExport.getNamedExports().map((namedExport) => namedExport.getName()))
    const hasExistingNamedExports = namedExports.every((namedExport) => existingNamedExports.has(namedExport))

    if (hasExistingNamedExports) {
      getLogger().info(`Export ${moduleSpecifier} with names ${namedExports.join(', ')} already exists in file ${file.getBaseName()}, skipping...`)

      return file
    }

    existingExport.addNamedExports(namedExports)

    return file
  }

  file.addExportDeclaration({
    isTypeOnly,
    moduleSpecifier,
    namedExports,
  })

  return file
}
