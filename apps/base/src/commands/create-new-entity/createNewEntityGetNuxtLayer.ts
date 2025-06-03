import { NUXT_PATH } from '#constants/paths.constants.ts'
import { getFolders } from '#utils/folders/getFolders.utils.ts'
import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { getInputSelect } from '#utils/input/getInputSelect.utils.ts'

export async function getNuxtLayer(): Promise<string> {
  const rootWorkspacePath = await getRootFolder()
  const folders = await getFolders(`${rootWorkspacePath}/${NUXT_PATH}/layers`)
  const layerOptions = folders.map((folder) => ({
    description: folder.path,
    label: `Layer: ${folder.name}`,
  }))

  const selection = await getInputSelect({
    title: 'Select a Nuxt layer',
    options: layerOptions,
    placeholder: 'Select a Nuxt layer',
  })

  if (selection == null) {
    throw new Error('No layer selected')
  }
  const selectedModule = selection.replace('Layer: ', '')

  return selectedModule
}
