/* eslint-disable no-console */
import { useLogger } from 'reactive-vscode'

import { getInputType } from '#utils/input/inputType.utils.ts'

export function getLogger() {
  const inputType = getInputType()

  if (inputType === 'cli') {
    return {
      error: (message: string) => console.error(message),
      info: (message: string) => console.info(message),
      warn: (message: string) => console.warn(message),
    }
  }
  else if (inputType === 'vscode') {
    return useLogger('monorepo-code-generator')
  }
  throw new Error('Invalid input type. Must be "cli" or "vscode".')
}
