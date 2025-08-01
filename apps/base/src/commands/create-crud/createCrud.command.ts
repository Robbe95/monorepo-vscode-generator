import { getRunCommandAbstraction } from '#abstractions/runCommand.abstraction.ts'
import { getConfig } from '#config/getConfig.ts'
import { allCases } from '#utils/casing/caseTransformer.utils.ts'
import { getInputSelect } from '#utils/input/getInputSelect.utils.ts'
import { getInputString } from '#utils/input/getInputString.utils.ts'

import { createCrudCreate } from './create/createCrudCreate'
import { createCrudDelete } from './delete/createCrudDelete'
import { createCrudDetail } from './detail/createCrudDetail'
import { createCrudIndex } from './index/createCrudIndex'
import { createCrudQueryKeys } from './query-keys/createCrudQueryKeys'
import { createCrudRoutes } from './routes/createCrudRoutes'
import { createCrudService } from './service/createCrudService'
import { createCrudUpdate } from './update/createCrudUpdate'
import { createCrudUuid } from './uuid/createCrudUuid'

export async function createCrudCommand() {
  await getConfig()

  const runCommand = getRunCommandAbstraction()

  const entityName = allCases(await getInputString({
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

  await createCrudQueryKeys({
    entityName,
    keys: selectedCruds.filter((key) => key === 'index' || key === 'update'),
  })

  if (crudSelection.includes('Index')) {
    await createCrudIndex({
      entityName,
    })
  }
  if (crudSelection.includes('Detail')) {
    await createCrudDetail({
      entityName,
    })
  }
  if (crudSelection.includes('Create')) {
    await createCrudCreate({
      entityName,
    })
  }
  if (crudSelection.includes('Update')) {
    await createCrudUpdate({
      entityName,
    })
  }
  if (crudSelection.includes('Delete')) {
    await createCrudDelete({
      entityName,
    })
  }

  await runCommand(`pnpm run lint`)
}
