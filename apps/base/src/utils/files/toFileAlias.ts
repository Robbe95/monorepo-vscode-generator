export function toFileAlias(filePath: {
  name: string
  path: string
}): string {
  // replace src with @ to create an alias
  return `${filePath.path.replace(/^src\//, '@/')}/${filePath.name}`
}
