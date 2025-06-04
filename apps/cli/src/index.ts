#!/usr/bin/env node
import process from 'node:process'

import { createNewEntityCommand } from '@repo/base'
import { Command } from 'commander'

import { setCliAbsctractions } from '#abstractions/setCliAbstractions.ts'

process.on('SIGINT', () => process.exit(0))
process.on('SIGTERM', () => process.exit(0))

function main() {
  setCliAbsctractions()

  const program = new Command()
    .name('code-generator')
    .description('scaffold your code with ease')
    .version(
      '0.1.0',
      '-v, --version',
      'display the version number',
    )

  program
    .addCommand(createNewEntityCommand)

  program.parse()
}

main()
