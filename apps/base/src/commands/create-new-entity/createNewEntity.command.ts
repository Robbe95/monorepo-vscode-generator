import { createNewEntityCollection } from '#commands/create-new-entity/createNewEntityCollection.ts'
import { createNewEntityContract } from '#commands/create-new-entity/createNewEntityContract.ts'
import { createNewEntityModel } from '#commands/create-new-entity/createNewEntityModel.ts'
import { createNewEntityPayloadModule } from '#commands/create-new-entity/createNewEntityPayloadModule.ts'
import { runEslintFix } from '#utils/cli/runEslintFix.utils.ts'
import { runPayloadGenerate } from '#utils/cli/runPayloadGenerate.utils.ts'
import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { getInputString } from '#utils/input/getInputString.utils.ts'
import { getLogger } from '#utils/logger/logger.utils.ts'

import { getNuxtLayer } from './createNewEntityGetNuxtLayer'
import { createNewEntityNuxtApi } from './createNewEntityNuxtApi'

export async function createNewEntityCommand() {
  const rootWorkspacePath = await getRootFolder()
  const logger = getLogger()

  const entityName = await getInputString({
    title: 'Create New Entity',
    prompt: 'Enter the name of the new entity (in singular)',
  })

  if (!rootWorkspacePath) {
    logger.error('No workspace folder found')

    return
  }

  // We get the payload module name from the entity name
  const payloadModuleName = entityName

  // We ask the nuxt layer so we know where to create the calls for the new entity
  const layerName = await getNuxtLayer()

  logger.info(`Module ${payloadModuleName} selected`)

  createNewEntityCollection(entityName)
  createNewEntityModel(entityName)
  createNewEntityContract(entityName)
  createNewEntityPayloadModule(entityName)
  createNewEntityNuxtApi({
    entityName,
    layerName,
  })

  await runPayloadGenerate()
  await runEslintFix()

  logger.info(`Entity ${entityName} created successfully`)
}
