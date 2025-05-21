import {
  defineExtension,
  useCommands,
} from 'reactive-vscode'

import { createNewEntityCommand } from '#commands/create-new-entity/createNewEntity.command.ts'

const {
  activate, deactivate,
} = defineExtension(() => {
  useCommands({
    'monorepoCodeGenerator.createEntity': createNewEntityCommand,
  })
})

export {
  activate, deactivate,
}
