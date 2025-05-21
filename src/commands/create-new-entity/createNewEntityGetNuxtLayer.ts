import { window } from 'vscode'

import { NUXT_PATH } from '#constants/paths.constants.ts'
import { getFolders } from '#utils/folders/getFolders.utils.ts'
import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'

export async function getNuxtLayer(): Promise<string> {
  const rootWorkspacePath = getRootFolder()
  const folders = await getFolders(`${rootWorkspacePath}/${NUXT_PATH}/layers`)
  const layerOptions = folders.map((folder) => ({
    description: folder.path,
    label: `Layer: ${folder.name}`,
  }))

  const selection = await window.showQuickPick(
    layerOptions,
    {
      canPickMany: false,
      placeHolder: 'Select a nuxt layer',
    },
  )

  if (selection == null) {
    throw new Error('No layer selected')
  }
  const selectedModule = selection?.label.replace('Layer: ', '')

  return selectedModule
}
