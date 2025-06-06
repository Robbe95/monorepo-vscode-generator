import { createCrudCommand } from '@repo/base'
import { Command } from 'commander'

export const createCrudCli = new Command('create:crud')
  .description('Scaffold a CRUD interface for an entity')
  .action(() => {
    createCrudCommand()
  })
