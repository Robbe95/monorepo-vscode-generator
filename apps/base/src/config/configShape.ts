export const REQUIRED_CONFIG_INFORMATION = [
  'languageFileLocation',
  'queryFileKeyLocation',
  'routerFileLocation',
  'tsConfigFileName',
] as const
export type ConfigInfo = typeof REQUIRED_CONFIG_INFORMATION[number]

export type ConfigFile = Record<typeof REQUIRED_CONFIG_INFORMATION[number], string>
export const CONFIG_FILE_PATH = './codeGenerator.config.json'
export const DEFAULT_LANGUAGE_FILE_LOCATION = './src/locales/en-US.json'
export const DEFAULT_QUERY_FILE_KEY_LOCATION = './src/types/queryKey.type.ts'
export const DEFAULT_ROUTER_FILE_LOCATION = './src/routes/routes.ts'
export const DEFAULT_TS_CONFIG_FILE_NAME = 'tsconfig.json'
