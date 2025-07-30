import { toFileAlias } from './toFileAlias'

export function toTsImport(filePath: {
  isType?: boolean
  name: string
  methodNames: string[]
  path: string
}): string {
  // replace src with @ to create an alias
  if (filePath.isType) {
    return `import type { ${filePath.methodNames?.join(', ')} } from '${toFileAlias(filePath)}'`
  }

  return `import { ${filePath.methodNames?.join(', ')} } from '${toFileAlias(filePath)}'`
}
