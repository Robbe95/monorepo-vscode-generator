import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { getInputSelect } from '#utils/input/getInputSelect.utils.ts'
import { getInputString } from '#utils/input/getInputString.utils.ts'
import { getLogger } from '#utils/logger/logger.utils.ts'

import { createCrudCreate } from './create/createCrudCreate'
import { createCrudDetail } from './detail/createCrudDetail'
import { createCrudIndex } from './index/createCrudIndex'
import { createCrudRoutes } from './routes/createCrudRoutes'
import { createCrudService } from './service/createCrudService'
import { createCrudUpdate } from './update/createCrudUpdate'
import { createCrudUuid } from './uuid/createCrudUuid'

export async function createCrudCommand() {
  const logger = getLogger()

  logger.info(`Creating new entity}`)

  const entityName = CaseTransformer.toCamelCase(await getInputString({
    title: 'Create new CRUD',
    prompt: 'Enter the name of the new entity (in singular)',
  }))

  const crudSelection = await getInputSelect({
    title: 'Select which functionality to generate',
    canSelectMultiple: true,
    canTypeValue: false,
    options: [
      {
        description: 'Index',
        initialPicked: true,
        label: 'Index',
      },
      {
        description: 'Detail',
        initialPicked: true,
        label: 'Detail',
      },
      {
        description: 'Create',
        initialPicked: true,
        label: 'Create',
      },
      {
        description: 'Update',
        initialPicked: true,
        label: 'Update',
      },

      {
        description: 'Delete',
        initialPicked: true,
        label: 'Delete',
      },
    ],
    placeholder: 'Select which functionality to generate',
  })

  const selectedCruds = crudSelection.map((crud) => {
    if (crud === 'Index') { return 'index' }
    if (crud === 'Detail') { return 'detail' }
    if (crud === 'Create') { return 'create' }
    if (crud === 'Update') { return 'update' }
    if (crud === 'Delete') { return 'delete' }
    throw new Error(`Unknown CRUD selection: ${crud}`)
  })

  await createCrudUuid({
    entityName,
  })
  await createCrudRoutes({
    entityName,
    routes: selectedCruds,
  })
  await createCrudService({
    entityName,
  })

  if (crudSelection.includes('Index')) {
    logger.info(`Generating Index for ${entityName}`)
    await createCrudIndex({
      entityName,
    })
  }
  if (crudSelection.includes('Detail')) {
    logger.info(`Generating Detail for ${entityName}`)
    await createCrudDetail({
      entityName,
    })
  }
  if (crudSelection.includes('Create')) {
    logger.info(`Generating Create for ${entityName}`)
    await createCrudCreate({
      entityName,
    })
  }
  if (crudSelection.includes('Update')) {
    logger.info(`Generating Update for ${entityName}`)
    await createCrudUpdate({
      entityName,
    })
  }
  if (crudSelection.includes('Delete')) {
    logger.info(`Generating Delete for ${entityName}`)
    // Call the function to generate Delete
  }
}
