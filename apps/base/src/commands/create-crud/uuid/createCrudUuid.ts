import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'

import { getCreateCrudUuidModelFile } from './createCrudUuid.files'

interface CreateCrudUuidOptions {
  entityName: string
}

export async function createCrudUuid({
  entityName,
}: CreateCrudUuidOptions) {
  const {
    name, path,
  } = getCreateCrudUuidModelFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addImport({
      moduleSpecifier: 'zod',
      namedImports: [
        'z',
      ],
    })
    .addVariable({
      isExported: true,
      name: `${entityName}UuidSchema`,
      initializer: `z.string().uuid().brand('${entityName}Uuid')`,
    })
    .addType({
      isExported: true,
      name: `${CaseTransformer.toPascalCase(entityName)}Uuid`,
      type: `z.infer<typeof ${entityName}UuidSchema>`,
    })
    .save()
}
