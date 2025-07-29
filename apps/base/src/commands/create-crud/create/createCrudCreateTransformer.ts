import { BASE_PATH } from '#constants/paths.constants.ts'
import { getCases } from '#utils/casing/caseTransformer.utils.ts'
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
  const entityCasings = getCases(entityName)

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: `@/models/${entityCasings.kebabCase}/create/${entityName}CreateForm.model.ts`,
      namedImports: [
        `${entityCasings.pascalCase}CreateForm`,
      ],
    })
    .addClass({
      isExported: true,
      name: `${entityCasings.pascalCase}CreateTransformer`,
    })
    .addClassMethod({
      isStatic: true,
      name: 'toDto',
      nameClass: `${entityCasings.pascalCase}CreateTransformer`,
      parameters: [
        {
          name: 'form',
          type: `${entityCasings.pascalCase}CreateForm`,
        },
      ],
      returnType: `any`, // Update this to the correct DTO type
      statements: [
        `return { /* TODO Map form properties to DTO properties */ }`,
      ],
    })
    .save()
}
