import { createNewEntityCommand } from '@repo/base'
import { Command } from 'commander'

export const createEntityCli = new Command('create:entity')
  .description('create a new entity')
  .action(() => {
    createNewEntityCommand()
  })
