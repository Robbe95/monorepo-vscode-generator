import { PAYLOAD_PATH } from '#constants/paths.constants.ts'
import { getFolders } from '#utils/folders/getFolders.utils.ts'
import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { getInputSelect } from '#utils/input/getInputSelect.utils.ts'
import { getInputString } from '#utils/input/getInputString.utils.ts'

export async function getPayloadModule(entityName: string): Promise<string> {
  const rootWorkspacePath = await getRootFolder()
  const folders = await getFolders(`${rootWorkspacePath}/${PAYLOAD_PATH}/src/modules`)
  const moduleOptions = folders.map((folder) => ({
    description: folder.path,
    label: `Module: ${folder.name}`,
  }))

  const selection = await getInputSelect({
    title: 'Select Payload Module',
    options: [
      {
        description: 'Create a new module',
        label: 'Make a new module',
      },

      ...moduleOptions,
    ],
    placeholder: 'Select a payload module or create a new one',
  })

  if (selection === 'Make a new module') {
    const moduleName = await getInputString({
      title: `Create New Module`,
      prompt: `Enter the name of the new module or leave empty to use the default (DEFAULT="${entityName}) entity name`,
    })

    return moduleName == null || moduleName === '' ? entityName : moduleName
  }

  if (selection == null) {
    throw new Error('No module selected')
  }
  const selectedModule = selection.replace('Module: ', '')

  return selectedModule
}
