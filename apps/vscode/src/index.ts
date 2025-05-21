import {
  createNewEntityCommand,
  setInputType,
} from '@repo/base'
import {
  defineExtension,
  useCommands,
} from 'reactive-vscode'

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
