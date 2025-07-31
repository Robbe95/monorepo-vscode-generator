import { BASE_PATH } from '#constants/paths.constants.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import type { CreateCrudCreateParams } from './createCrudCreate'
import {
  getCreateCrudCreateFormModelFile,
  getCreateCrudCreateTransformerFile,
} from './createCrudCreate.files'

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
  const createFormFile = getCreateCrudCreateFormModelFile(entityName)

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(createFormFile),
      namedImports: [
        `${entityName.pascalCase}CreateForm`,
      ],
    })
    .addClass({
      isExported: true,
      name: `${entityName.pascalCase}CreateTransformer`,
    })
    .addClassMethod({
      isStatic: true,
      name: 'toDto',
      nameClass: `${entityName.pascalCase}CreateTransformer`,
      parameters: [
        {
          name: 'form',
          type: `${entityName.pascalCase}CreateForm`,
        },
      ],
      returnType: `any`, // Update this to the correct DTO type
      statements: [
        `return { /* TODO Map form properties to DTO properties */ }`,
      ],
    })
    .save()
}
