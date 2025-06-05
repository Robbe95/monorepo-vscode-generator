import process from 'node:process'

import {
  select,
  text,
  multiselect,
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

async function cliGetInputSelect<TMulti extends boolean>({
  title,
  options,
  canSelectMultiple,
  canTypeValue = false,
}: InputSelectOptions<TMulti>) {

  if (canSelectMultiple && canTypeValue) {
    throw new Error('You cannot select multiple options and type a value at the same time.')
  }
  const typingOption = {
    label: 'Custom value',
    description: 'You can type a value that is not in the list', 
  }
  if (canTypeValue) {
    options = [...options, typingOption]
  }


  const initialValues = options
    .filter((option) => option.initialPicked)
    
    .map((option) => option.label)
  if (canSelectMultiple) {
    const selectedOptions = await multiselect({
      message: title,
      initialValues,
      options: options.map((option) => ({
        hint: option.description,
        label: option.label,
        value: option.label,
      })),
      required: true,
    })

    return selectedOptions as string[]
  }


  const mappedOptions = options.map((option) => ({
    hint: option.description,
    label: option.label,
    value: option.label,
  }))
  const selectedOption = await select({
    message: title,
    options: mappedOptions,
  })

  if (selectedOption === 'Custom value') {
    const customValue = await cliGetInputString({
      title,
      prompt: 'Please type your custom value',
    })
    return customValue
  }

  return selectedOption as string
}

function cliGetRootFolder(): string {
  return process.cwd()
}
