// import { exec } from 'node:child_process'
// import { promisify } from 'node:util'

// import * as vscode from 'vscode'

// import { getLogger } from '#utils/logger/logger.utils.ts'

// const execPromise = promisify(exec)

export function runPayloadGenerate() {
  // const logger = getLogger()
  // const editor = vscode.window.activeTextEditor

  // if (!editor) {
  //   vscode.window.showWarningMessage('No active text editor found.')

  //   return
  // }

  // const documentUri = editor.document.uri

  // const workspaceFolder = vscode.workspace.getWorkspaceFolder(documentUri)
  // let cwd: string

  // if (workspaceFolder) {
  //   cwd = workspaceFolder.uri.fsPath
  // }
  // else {
  //   vscode.window.showWarningMessage('No workspace folder found for the current file.')
  // }

  // return new Promise((resolve) => vscode.window.withProgress({
  //   title: 'Running payload generate types...',
  //   cancellable: false,
  //   location: vscode.ProgressLocation.Notification,
  // }, async () => {
  //   try {
  //     await execPromise('pnpm generate:types', {
  //       cwd,
  //     })
  //     vscode.window.showInformationMessage('Generate types completed successfully!')
  //   }
  //   catch (error: any) {
  //     logger.error(error.message)
  //     console.error('Error running generate types fix:', error)
  //     vscode.window.showErrorMessage(`Error running generate types fix: ${error.message || error}`)
  //   }
  // }).then(() => resolve(true)))
}
