import { allCases } from '#utils/casing/caseTransformer.utils.ts'

import { toFileAlias } from './toFileAlias'

export function toVueImport(filePath: {
  isType?: boolean
  name: string
  path: string
}): string {
  const fileName = filePath.name.replace(/\.vue$/, '')
  const casing = allCases(fileName)

  // replace src with @ to create an alias
  return `import ${casing.pascalCase} from '${toFileAlias(filePath)}'`
}
