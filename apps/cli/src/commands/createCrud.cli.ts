import { createCrudCommand } from '@repo/base'
import { Command } from 'commander'

export const createCrudCli = new Command('create:crud')
  .description('create a new crud entity')
  .action(() => {
    createCrudCommand()
  })
