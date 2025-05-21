import process from 'node:process'

import { useWorkspaceFolders } from 'reactive-vscode'
import { window } from 'vscode'

import { getInputType } from '#utils/input/inputType.utils.ts'

export function getRootFolder() {
  const inputType = getInputType()

  if (inputType === 'cli') {
    return getCliRootFolder()
  }
  if (inputType === 'vscode') {
    return getVscodeRootFolder()
  }
}

export function getPayloadRootFolder() {
  const rootFolder = getRootFolder()
  const payloadRootFolder = `${rootFolder}/apps/payload`

  return payloadRootFolder
}

export function getCliRootFolder() {
  return process.cwd()
}

export function getVscodeRootFolder() {
  const workspaceFolders = useWorkspaceFolders()
  const rootWorkspacePath = workspaceFolders.value?.[0]?.uri.path

  if (!rootWorkspacePath) {
    window.showErrorMessage('No workspace folder found')
  }

  return rootWorkspacePath
}
