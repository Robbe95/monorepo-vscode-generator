import { setVscodeAbstractions } from '#abstractions/setVscodeAbstractions.ts'
import {
  createCrudCommand,
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
  setVscodeAbstractions()
  setInputType('vscode')
  useCommands({
    'monorepoCodeGenerator.createEntity': createNewEntityCommand,
    'monorepoCodeGenerator.createCrud': createCrudCommand,
  })
})

export {
  activate, deactivate,
}
