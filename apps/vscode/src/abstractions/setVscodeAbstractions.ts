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
import { QuickPickItem, window } from 'vscode'

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

async function vscodeGetInputSelect<TMulti extends boolean>({
  title,
  options,
  placeholder,
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

  const mappedOptions: QuickPickItem[] = options.map((option) => ({
    label: option.label,
    description: option.description,
    picked: option.initialPicked,
    
  }))


  const optionsWithTyping = canTypeValue ? [...mappedOptions, typingOption] : mappedOptions
  const selection = await window.showQuickPick(optionsWithTyping, {
    title,
    canPickMany: canSelectMultiple,
    placeHolder: placeholder,

  })



  if(canSelectMultiple) {
    const multiSelection = selection as any as { label: string }[]
    if (multiSelection.length === 0) {
      throw new Error('No selection made')
    }
    return multiSelection.map(item => item.label)
  }

  if (selection == null) {
    throw new Error('No selection made')
  }

  if (selection?.label === 'Custom value') {
    const customValue = await vscodeGetInputString({
      title,
      prompt: 'Type your custom value:',
    })
    return customValue
  }

  return selection.label
}

function vscodeGetRootFolder(): string {
  const workspaceFolders = useWorkspaceFolders()
  const rootWorkspacePath = workspaceFolders.value?.[0]?.uri.path

  if (!rootWorkspacePath) {
    throw new Error('No workspace folder found')
  }

  return rootWorkspacePath
}
