import {
  defineExtension,
  useCommands,
} from 'reactive-vscode'
import { window } from 'vscode'

import { createNewEntityCommand } from '#commands/create-new-entity/createNewEntity.command.ts'

const {
  activate, deactivate,
} = defineExtension(() => {
  window.showInformationMessage('Hello again')
  useCommands({
    'generator.createEntity': createNewEntityCommand,
  })
})

export {
  activate, deactivate,
}
