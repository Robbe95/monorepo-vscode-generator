import type { OutputChannel } from 'vscode'
import { window } from 'vscode'

let channel: OutputChannel | null = null

export function logMessage(message: string) {
  if (channel == null) {
    channel = window.createOutputChannel('GeneratorExtension', 'generate-extension')
  }

  channel.appendLine(message)
}
