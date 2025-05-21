import { window } from 'vscode'

export function getInputString({
  title, prompt,
}: { title: string
  prompt: string }): Promise<string> {
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
