export interface EntityCasing {
  toCamelCase: (str: string) => string
  toKebabCase: (str: string) => string
  toPascalCase: (str: string) => string
  toSnakeCase: (str: string) => string
  toUpperCase: (str: string) => string
}

export const CaseTransformer: EntityCasing = {
  toCamelCase: (str: string) => {
    return str
      .replace(/^\w|[A-Z]|\b\w|\s+/g, (match, index) => {
        if (Number(match) === 0) { return '' }

        return index === 0 ? match.toLowerCase() : match.toUpperCase()
      })
      .replace(/[^a-z0-9]/gi, '')
  },
  toKebabCase: (str: string) => {
    return str
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '-') // Replace non-alphanumeric with dashes
  },
  toPascalCase: (str: string) => {
    return str
      .replace(/^\w|[A-Z]|\b\w|\s+/g, (match) => {
        if (Number(match) === 0) { return '' }

        return match.toUpperCase()
      })
      .replace(/[^a-z0-9]/gi, '')
  },
  toSnakeCase: (str: string) => {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '_') // Replace non-alphanumeric with underscores
  },
  toUpperCase: (str: string) => {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toUpperCase()
      .replace(/[^A-Z0-9]/gi, '_') // Replace non-alphanumeric with underscores
  },
}
