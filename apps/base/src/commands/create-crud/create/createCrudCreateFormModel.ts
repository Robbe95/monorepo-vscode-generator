import { BASE_PATH } from '#constants/paths.constants.ts'
import { getCases } from '#utils/casing/caseTransformer.utils.ts'
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

  const entityCasings = getCases(entityName)

  fileManipulator
    .addImport({
      moduleSpecifier: `zod`,
      namedImports: [
        `z`,
      ],
    })
    .addImport({
      moduleSpecifier: `@/models/${entityCasings.kebabCase}/${entityName}Uuid.model.ts`,
      namedImports: [
        `${entityCasings.camelCase}UuidSchema`,
      ],
    })
    .addVariable({
      isExported: true,
      name: `${entityName}CreateFormSchema`,
      comment: `// TODO Update z.object to the correct schema for ${entityName}CreateForm`,
      initializer: `z.object({
      uuid: ${entityCasings.camelCase}UuidSchema,
    })`,
    })
    .addType({
      isExported: true,
      name: `${entityCasings.pascalCase}CreateForm`,
      type: `z.infer<typeof ${entityName}CreateFormSchema>`,
    })
    .save()
}
