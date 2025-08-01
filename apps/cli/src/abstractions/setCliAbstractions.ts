import { exec } from 'node:child_process'
import process from 'node:process'

import {
  multiselect,
  select,
  text,
} from '@clack/prompts'
import type { InputSelectOptions } from '@repo/base'
import {
  setGetInputSelectAbstraction,
  setGetInputStringAbstraction,
  setGetRootFolderAbstraction,
  setLoggerExtraction,
  setRunCommandAbstraction,
} from '@repo/base'
import type { InputStringOptions } from 'node_modules/@repo/base/src/utils/input/getInputString.utils.ts'

export function setCliAbstractions() {
  setLoggerExtraction(cliLogger())
  setGetInputStringAbstraction(cliGetInputString)
  setGetInputSelectAbstraction(cliGetInputSelect)
  setGetRootFolderAbstraction(cliGetRootFolder)
  setRunCommandAbstraction(cliRunCommand)
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
    initialValue: '',
    message: `${input.title} - ${input.prompt}`,
    validate: (value) => {
      if (typeof value !== 'string') {
        return 'Input must be a string'
      }
      if (value.length === 0 && !input.canBeEmpty) {
        return 'Input cannot be empty'
      }
    },
  })

  return value as string
}

async function cliGetInputSelect<TMulti extends boolean>({
  title,
  canSelectMultiple,
  canTypeValue = false,
  options,
}: InputSelectOptions<TMulti>) {
  if (canSelectMultiple && canTypeValue) {
    throw new Error('You cannot select multiple options and type a value at the same time.')
  }
  const typingOption = {
    description: 'You can type a value that is not in the list',
    label: 'Custom value',
  }

  if (canTypeValue) {
    options = [
      ...options,
      typingOption,
    ]
  }

  const initialValues = options
    .filter((option) => option.initialPicked)

    .map((option) => option.label)

  if (canSelectMultiple) {
    const selectedOptions = await multiselect({
      initialValues,
      message: title,
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

function cliRunCommand(command: string): Promise<void> {
  // run the command in the current working directory
  return new Promise((resolve, reject) => {
    exec(command, {
      cwd: process.cwd(),
    }, (error: Error | null) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`)
        reject(error)
      }
      else {
        resolve()
      }
    })
  })
}
