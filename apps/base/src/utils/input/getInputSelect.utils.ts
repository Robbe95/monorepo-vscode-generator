import { select } from '@clack/prompts'
import { window } from 'vscode'

import { getInputType } from './inputType.utils'

interface InputSelectOptions {
  title: string
  options: {
    description: string
    label: string
  }[]
  placeholder: string
}
export async function getInputSelect({
  title,
  options,
  placeholder,
}: InputSelectOptions): Promise<string> {
  const inputType = getInputType()

  if (inputType === 'cli') {
    return await getInputSelectCli({
      title,
      options,
      placeholder,
    })
  }
  else if (inputType === 'vscode') {
    return await getInputSelectVscode({
      title,
      options,
      placeholder,
    })
  }

  throw new Error('Input type not set. Please set it using setInputType().')
}

async function getInputSelectVscode({
  title,
  options,
  placeholder,
}: InputSelectOptions): Promise<string> {
  const selection = await window.showQuickPick(options, {
    title,
    canPickMany: false,
    placeHolder: placeholder,
  })

  if (selection == null) {
    throw new Error('No option selected')
  }

  return selection.label
}

async function getInputSelectCli({
  title,
  options,
  placeholder,
}: InputSelectOptions): Promise<string> {
  const selectedOptions = await window.showQuickPick(options, {
    title,
    canPickMany: true,
    placeHolder: placeholder,
  })

  const mappedOptions = options.map((option) => ({
    hint: option.description,
    label: option.label,
    value: option.label,
  }))
  const projectType = await select({
    message: title,
    options: mappedOptions,
  })

  if (selectedOptions == null) {
    throw new Error('No option selected')
  }

  return projectType as string
}
