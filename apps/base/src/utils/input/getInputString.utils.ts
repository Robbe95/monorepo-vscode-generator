import { text } from '@clack/prompts'
import { window } from 'vscode'

import { getInputType } from './inputType.utils'

export async function getInputString({
  title, prompt,
}: {
  title: string
  prompt: string
}): Promise<string> {
  const inputType = getInputType()

  if (inputType === 'cli') {
    return await getInputStringCli({
      title,
      prompt,
    })
  }
  else if (inputType === 'vscode') {
    return await getInputStringVscode({
      title,
      prompt,
    })
  }

  throw new Error('Input type not set. Please set it using setInputType().')
}

function getInputStringVscode({
  title, prompt,
}: {
  title: string
  prompt: string
}): Promise<string> {
  const inputBox = window.createInputBox()

  inputBox.title = title
  inputBox.prompt = prompt
  inputBox.show()

  return new Promise((resolve) => {
    inputBox.onDidAccept(() => {
      const value = inputBox.value

      if (value) {
        resolve(value)
      }
      else {
        window.showErrorMessage('Input cannot be empty')
      }

      inputBox.dispose()
    })
    inputBox.onDidHide(() => {
      inputBox.dispose()
    })
  })
}

async function getInputStringCli({
  title, prompt,
}: {
  title: string
  prompt: string
}): Promise<string> {
  const value = await text({
    message: `${title} - ${prompt}`,
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
