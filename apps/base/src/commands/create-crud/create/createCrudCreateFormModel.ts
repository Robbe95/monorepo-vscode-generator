import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'

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

  fileManipulator
    .addImport({
      moduleSpecifier: `zod`,
      namedImports: [
        `z`,
      ],
    })
    .addImport({
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/${entityName}Uuid.model.ts`,
      namedImports: [
        `${CaseTransformer.toCamelCase(entityName)}UuidSchema`,
      ],
    })
    .addVariable({
      isExported: true,
      name: `${entityName}CreateFormSchema`,
      comment: `// TODO Update z.object to the correct schema for ${entityName}CreateForm`,
      initializer: `z.object({
      uuid: ${CaseTransformer.toCamelCase(entityName)}UuidSchema,
    })`,
    })
    .addType({
      isExported: true,
      name: `${CaseTransformer.toPascalCase(entityName)}CreateForm`,
      type: `z.infer<typeof ${entityName}CreateFormSchema>`,
    })
    .save()
}
