import { BASE_PATH } from '#constants/paths.constants.ts'
import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'

import type { CreateCrudCreateParams } from './createCrudCreate'
import { getCreateCrudCreateTransformerFile } from './createCrudCreate.files'

export async function createCrudCreateTransformer({
  entityName,
}: CreateCrudCreateParams) {
  const {
    name, path,
  } = getCreateCrudCreateTransformerFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: `@/models/${CaseTransformer.toKebabCase(entityName)}/create/${entityName}CreateForm.model.ts`,
      namedImports: [
        `${CaseTransformer.toPascalCase(entityName)}CreateForm`,
      ],
    })
    .addClass({
      isExported: true,
      name: `${CaseTransformer.toPascalCase(entityName)}CreateTransformer`,
    })
    .addClassMethod({
      isStatic: true,
      name: 'toDto',
      nameClass: `${CaseTransformer.toPascalCase(entityName)}CreateTransformer`,
      parameters: [
        {
          name: 'form',
          type: `${CaseTransformer.toPascalCase(entityName)}CreateForm`,
        },
      ],
      returnType: `any`, // Update this to the correct DTO type
      statements: [
        `return { /* TODO Map form properties to DTO properties */ }`,
      ],
    })
    .save()
}
