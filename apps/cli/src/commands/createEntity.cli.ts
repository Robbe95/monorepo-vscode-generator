// --- ESM-compatible way to get CommonJS 'require' ---

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { createNewEntityCommand } from '@repo/base'
import { Command } from 'commander'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const createNewEntityCli = new Command()
  .name('create:entity')
  .description('add a entity to your project')
  .action(() => {
    createNewEntityCommand()
  })
