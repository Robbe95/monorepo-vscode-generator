import process from 'node:process'

import {
  select,
  text,
} from '@clack/prompts'
import type { InputSelectOptions } from '@repo/base'
import {
  setGetInputSelectAbstraction,
  setGetInputStringAbstraction,
  setGetRootFolderAbstraction,
  setLoggerExtraction,
} from '@repo/base'
import type { InputStringOptions } from 'node_modules/@repo/base/src/utils/input/getInputString.utils.ts'

export function setCliAbsctractions() {
  setLoggerExtraction(cliLogger())
  setGetInputStringAbstraction(cliGetInputString)
  setGetInputSelectAbstraction(cliGetInputSelect)
  setGetRootFolderAbstraction(cliGetRootFolder)
}

function cliLogger() {
  return {
    // eslint-disable-next-line no-console
    debug: (message: string) => console.debug(message),
    error: (message: string) => console.error(message),
    // eslint-disable-next-line no-console
    info: (message: string) => console.info(message),
    warn: (message: string) => console.warn(message),
  }
}

async function cliGetInputString(input: InputStringOptions): Promise<string> {
  const value = await text({
    message: `${input.title} - ${input.prompt}`,
    validate: (value) => {
      if (typeof value !== 'string') {
        return 'Input must be a string'
      }
      if (value.length === 0) {
        return 'Input cannot be empty'
      }
    },
  })

  return value as string
}

async function cliGetInputSelect({
  title, options,
}: InputSelectOptions) {
  const mappedOptions = options.map((option) => ({
    hint: option.description,
    label: option.label,
    value: option.label,
  }))
  const selectedOption = await select({
    message: title,
    options: mappedOptions,
  })

  return selectedOption as string
}

function cliGetRootFolder(): string {
  return process.cwd()
}
