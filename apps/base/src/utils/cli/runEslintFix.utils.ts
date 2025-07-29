// import * as vscode from 'vscode' // Import vscode module

// const execPromise = promisify(exec)

export function runEslintFix() {
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
  //   vscode.window.showWarningMessage('No workspace folder found for the current file. ESLint might not run correctly.')
  // }

  // return new Promise((resolve) => vscode.window.withProgress({
  //   title: 'Running ESLint Fix...',
  //   cancellable: false,
  //   location: vscode.ProgressLocation.Notification,
  // }, async () => {
  //   try {
  //     await execPromise('pnpm lint:fix', {
  //       cwd,
  //     })
  //     vscode.window.showInformationMessage('ESLint fix completed successfully!')
  //   }
  //   catch {
  //     vscode.window.showInformationMessage('ESLint fix completed successfully!')
  //   }
  // }).then(() => resolve(true)))
}
