import type { InputSelectOptions } from '@repo/base'
import {
  setGetInputSelectAbstraction,
  setGetInputStringAbstraction,
  setGetRootFolderAbstraction,
  setLoggerExtraction,
} from '@repo/base'
import {
  useLogger,
  useWorkspaceFolders,
} from 'reactive-vscode'
import { window } from 'vscode'

export function setVscodeAbstractions() {
  setLoggerExtraction(vscodeLogger())
  setGetInputStringAbstraction(vscodeGetInputString)
  setGetInputSelectAbstraction(vscodeGetInputSelect)
  setGetRootFolderAbstraction(vscodeGetRootFolder)
}

function vscodeLogger() {
  return useLogger('monorepo-code-generator')
}

function vscodeGetInputString(input: {
  title: string
  prompt: string
}): Promise<string> {
  const inputBox = window.createInputBox()

  inputBox.title = input.title
  inputBox.prompt = input.prompt
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

async function vscodeGetInputSelect({
  title,
  options,
  placeholder,
}: InputSelectOptions) {
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

function vscodeGetRootFolder(): string {
  const workspaceFolders = useWorkspaceFolders()
  const rootWorkspacePath = workspaceFolders.value?.[0]?.uri.path

  if (!rootWorkspacePath) {
    window.showErrorMessage('No workspace folder found')

    throw new Error('No workspace folder found')
  }

  return rootWorkspacePath
}
