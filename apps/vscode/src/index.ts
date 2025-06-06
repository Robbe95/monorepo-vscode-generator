import {
  createCrudCommand,
  createNewEntityCommand,
  setInputType,
} from '@repo/base'
import {
  defineExtension,
  useCommands,
} from 'reactive-vscode'

import { setVscodeAbstractions } from '#abstractions/setVscodeAbstractions.ts'

const {
  activate, deactivate,
} = defineExtension(() => {
  setVscodeAbstractions()
  setInputType('vscode')
  useCommands({
    'wisemenCodeGenerator.createCrud': createCrudCommand,
    'wisemenCodeGenerator.createEntity': createNewEntityCommand,
  })
})

export {
  activate, deactivate,
}
