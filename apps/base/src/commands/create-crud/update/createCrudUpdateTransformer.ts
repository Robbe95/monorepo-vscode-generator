import { getCreateCrudDetailModelFile } from '#commands/create-crud/detail/createCrudDetail.files.ts'
import { BASE_PATH } from '#constants/paths.constants.ts'
import { FileManipulator } from '#utils/file-manipulator/fileManipulator.ts'
import { toFileAlias } from '#utils/files/toFileAlias.ts'

import type { CreateCrudUpdateParams } from './createCrudUpdate'
import {
  getCreateCrudUpdateFormModelFile,
  getCreateCrudUpdateTransformerFile,
} from './createCrudUpdate.files'

export async function createCrudUpdateTransformer({
  entityName,
}: CreateCrudUpdateParams) {
  const {
    name, path,
  } = getCreateCrudUpdateTransformerFile(entityName)

  const fileManipulator = await FileManipulator.create({
    name,
    projectPath: BASE_PATH,
    path,
  })

  fileManipulator
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudDetailModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}Detail`,
      ],
    })
    .addImport({
      isTypeOnly: true,
      moduleSpecifier: toFileAlias(getCreateCrudUpdateFormModelFile(entityName)),
      namedImports: [
        `${entityName.pascalCase}UpdateForm`,
      ],
    })
    .addClass({
      isExported: true,
      name: `${entityName.pascalCase}UpdateTransformer`,
    })
    .addClassMethod({
      isStatic: true,
      name: 'toDto',
      comment: `// TODO Update the type of form to the correct form type for ${entityName.pascalCase}UpdateTransformer`,
      nameClass: `${entityName.pascalCase}UpdateTransformer`,
      parameters: [
        {
          name: 'form',
          type: `${entityName.pascalCase}UpdateForm`,
        },
      ],
      returnType: `any`, // Update this to the correct DTO type
      statements: [
        `return { /* TODO Map form properties to DTO properties */ }`,
      ],
    })
    .addClassMethod({
      isStatic: true,
      name: 'toForm',
      nameClass: `${entityName.pascalCase}UpdateTransformer`,
      parameters: [
        {
          name: `${entityName.camelCase}`,
          type: `${entityName.pascalCase}Detail`, // Update this to the correct DTO type
        },
      ],
      returnType: `${entityName.pascalCase}UpdateForm`,
      statements: [
        `return { 
          uuid: ${entityName.camelCase}.uuid,
          /* TODO Map dto properties to form properties */
         }`,
      ],
    })
    .save()
}
