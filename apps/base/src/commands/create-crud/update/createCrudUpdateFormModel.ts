import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import type { CreateCrudUpdateParams } from './createCrudUpdate'
import { getCreateCrudUpdateFormModelFile } from './createCrudUpdate.files'

export async function createCrudUpdateFormModel({
  entityName,
}: CreateCrudUpdateParams) {
  const {
    name, path,
  } = getCreateCrudUpdateFormModelFile(entityName)
  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addImport({
      moduleSpecifier: `zod`,
      namedImports: [
        `z`,
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(getCreateCrudUuidModelFile(entityName)),
      namedImports: [
        `${entityName.camelCase}UuidSchema`,
      ],
    })
    .addVariable({
      isExported: true,
      name: `${entityName.camelCase}UpdateFormSchema`,
      comment: `// TODO Update z.object to the correct schema for ${entityName.camelCase}UpdateForm`,
      initializer: `z.object({
        uuid: ${entityName.camelCase}UuidSchema,
      })`,
    })
    .addType({
      isExported: true,
      name: `${entityName.pascalCase}UpdateForm`,
      type: `z.infer<typeof ${entityName.camelCase}UpdateFormSchema>`,
    })
    .save()
}
