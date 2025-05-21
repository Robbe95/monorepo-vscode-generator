import { useWorkspaceFolders } from 'reactive-vscode'
import { window } from 'vscode'

export function getRootFolder() {
  const workspaceFolders = useWorkspaceFolders()
  const rootWorkspacePath = workspaceFolders.value?.[0]?.uri.path
  if (!rootWorkspacePath) {
    window.showErrorMessage('No workspace folder found')
  }
  return rootWorkspacePath
}

export function getPayloadRootFolder() {
  const rootFolder = getRootFolder()
  const payloadRootFolder = `${rootFolder}/apps/payload`
  return payloadRootFolder
}
