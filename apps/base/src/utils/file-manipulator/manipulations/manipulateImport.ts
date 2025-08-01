import type { SourceFile } from 'ts-morph'

import { getLogger } from '#utils/logger/logger.utils.ts'

export interface ManipulateImportOptions {
  isTypeOnly?: boolean
  file: SourceFile
  moduleSpecifier: string
  namedImports: string[]
}

export function manipulateImport({
  isTypeOnly = false,
  file,
  moduleSpecifier,
  namedImports,
}: ManipulateImportOptions) {
  // check if the import already exists and if the named imports are already present
  const allExistingImports = file.getImportDeclarations()
  const existingImports = allExistingImports.filter((imp) => imp.getModuleSpecifierValue() === moduleSpecifier)
  const matchingTypedImport = existingImports.find((imp) => imp.isTypeOnly() === isTypeOnly)

  if (matchingTypedImport) {
    const existingNamedImports = new Set(
      matchingTypedImport
        .getNamedImports()
        .map((namedImport) => namedImport.getName()),
    )
    const hasExistingNamedImports = namedImports.every((namedImport) => existingNamedImports.has(namedImport))

    if (hasExistingNamedImports) {
      getLogger().info(`Import ${moduleSpecifier} with names ${namedImports.join(', ')} already exists in file ${file.getBaseName()}, skipping...`)

      return file
    }

    matchingTypedImport.addNamedImports(namedImports)

    return file
  }

  file.addImportDeclaration({
    isTypeOnly,
    moduleSpecifier,
    namedImports,
  })

  return file
}
