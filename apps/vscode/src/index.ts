import {
  defineExtension,
  useCommands,
} from 'reactive-vscode'

import { createNewEntityCommand, setInputType } from '@repo/base'

const {
  activate, deactivate,
} = defineExtension(() => {
  
  setInputType('vscode')
  useCommands({
    'monorepoCodeGenerator.createEntity': createNewEntityCommand,
  })
})

export {
  activate, deactivate,
}
