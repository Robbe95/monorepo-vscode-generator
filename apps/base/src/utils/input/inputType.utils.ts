let INPUT_TYPE: 'cli' | 'vscode' | null = null

export function setInputType(inputType: 'cli' | 'vscode') {
  if (inputType !== 'cli' && inputType !== 'vscode') {
    throw new Error('Invalid input type. Must be "cli" or "vscode".')
  }

  INPUT_TYPE = inputType
}
export function getInputType() {
  if (INPUT_TYPE === null) {
    throw new Error('Input type is not set. Please set it using setInputType().')
  }

  return INPUT_TYPE
}
