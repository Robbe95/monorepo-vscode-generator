import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import type { CreateCrudCreateParams } from './createCrudCreate'
import { getCreateCrudCreateFormModelFile } from './createCrudCreate.files'

export async function createCrudCreateFormModel({
  entityName,
}: CreateCrudCreateParams) {
  const {
    name, path,
  } = getCreateCrudCreateFormModelFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  const uuidFile = getCreateCrudUuidModelFile(entityName)

  fileManipulator
    .addImport({
      moduleSpecifier: `zod`,
      namedImports: [
        `z`,
      ],
    })
    .addImport({
      moduleSpecifier: toFileAlias(uuidFile),
      namedImports: [
        `${entityName.camelCase}UuidSchema`,
      ],
    })
    .addVariable({
      isExported: true,
      name: `${entityName.camelCase}CreateFormSchema`,
      comment: `// TODO Update z.object to the correct schema for ${entityName.camelCase}CreateForm`,
      initializer: `z.object({
      uuid: ${entityName.camelCase}UuidSchema,
    })`,
    })
    .addType({
      isExported: true,
      name: `${entityName.pascalCase}CreateForm`,
      type: `z.infer<typeof ${entityName.camelCase}CreateFormSchema>`,
    })
    .save()
}
