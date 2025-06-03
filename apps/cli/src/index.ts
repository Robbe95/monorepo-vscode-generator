#!/usr/bin/env node
import process from 'node:process'

import { Command } from 'commander'

import { createNewEntityCli } from '#commands/createEntity.cli.ts'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

function main() {
  const program = new Command()
    .name('code-generator')
    .description('scaffold your code with ease')
    .version(
      '-v, --version',
      'display the version number',
    )

  program
    .addCommand(createNewEntityCli)

  program.parse()
}

main()
