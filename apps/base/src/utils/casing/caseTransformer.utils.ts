export const CaseTransformer = {
  /*
   * @param {string} str - The string to convert.
    * @returns {string} The camelCased string.
   */
  toCamelCase: (str: string) => {
    return str
      .replace(/^\w|[A-Z]|\b\w|\s+/g, (match, index) => {
        if (Number(match) === 0) { return '' }

        return index === 0 ? match.toLowerCase() : match.toUpperCase()
      })
      .replace(/[^a-z0-9]/gi, '')
  },
  toHumanReadable: (str: string) => {
    return str
      .replace(/([A-Z])/g, ' $1')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[^a-z0-9\s]/gi, '') // Remove non-alphanumeric characters except spaces
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize the first letter
  },
  /*
   * @param {string} str - The string to convert.
   * @returns {string} The kebab-cased string.
  */
  toKebabCase: (str: string) => {
    return str
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '-') // Replace non-alphanumeric with dashes
  },
  /*
   * @param {string} str - The string to convert.
    * @returns {string} The PascalCased string.
   */
  toPascalCase: (str: string) => {
    return str
      .replace(/^\w|[A-Z]|\b\w|\s+/g, (match) => {
        if (Number(match) === 0) { return '' }

        return match.toUpperCase()
      })
      .replace(/[^a-z0-9]/gi, '')
  },
  /*
   * @param {string} str - The string to convert.
   * @returns {string} The snake_cased string.
   */
  toSnakeCase: (str: string) => {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toLowerCase()
      .replace(/[^a-z0-9]/gi, '_') // Replace non-alphanumeric with underscores
  },

  /*
   * @param {string} str - The string to convert.
   * @returns {string} The uppercased string.
   */
  toUpperCase: (str: string) => {
    return str
      .replace(/([A-Z])/g, '_$1')
      .toUpperCase()
      .replace(/[^A-Z0-9]/gi, '_') // Replace non-alphanumeric with underscores
  },
}

export function allCases(str: string) {
  return {
    camelCase: CaseTransformer.toCamelCase(str),
    humanReadable: CaseTransformer.toHumanReadable(str),
    kebabCase: CaseTransformer.toKebabCase(str),
    pascalCase: CaseTransformer.toPascalCase(str),
    snakeCase: CaseTransformer.toSnakeCase(str),
    upperCase: CaseTransformer.toUpperCase(str),
  } as const
}

export function getCases(str: string) {
  return {
    camelCase: CaseTransformer.toCamelCase(str),
    humanReadable: CaseTransformer.toHumanReadable(str),
    kebabCase: CaseTransformer.toKebabCase(str),
    pascalCase: CaseTransformer.toPascalCase(str),
    snakeCase: CaseTransformer.toSnakeCase(str),
    upperCase: CaseTransformer.toUpperCase(str),
  } as const
}
