/* eslint-disable unicorn/no-keyword-prefix */
/* eslint-disable max-depth */
import { SyntaxKind } from 'ts-morph'

import { BASE_PATH } from '#constants/paths.constants.ts'
import { getTsSourceFile } from '#utils/ts-morph/getTsSourceFile.utils.ts'

export async function addTestId({
  key, value,
}: {
  key: string
  value: string
}): Promise<void> {
  const testIdFile = await getTsSourceFile({
    filePath: 'src/constants/testId.constant.ts',
    projectPath: BASE_PATH,
  })

  const testIdDeclaration = testIdFile
    .getVariableDeclarationOrThrow('TEST_ID')
    .getInitializerIfKindOrThrow(SyntaxKind.AsExpression)
    .getExpressionIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)

  const keys = key.split('.')
  let currentObject = testIdDeclaration

  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i]
    const property = currentObject.getProperty(currentKey)

    if (i === keys.length - 1) {
      // This is the last key, so we want to add the value
      if (!property) {
        // Property doesn't exist, so add it
        currentObject.addPropertyAssignment({
          name: currentKey,
          initializer: `'${value}'`, // Assuming the value is a string literal
        })
      }
      else {
        if (!property.isKind(SyntaxKind.PropertyAssignment)
          && !property.isKind(SyntaxKind.ShorthandPropertyAssignment)) {
          throw new Error(`Path conflict: '${keys.slice(0, i + 1).join('.')}' is not a simple property assignment.`)
        }
        const initializer = property.isKind(SyntaxKind.PropertyAssignment)
          ? property.getInitializerIfKind(SyntaxKind.StringLiteral)
          : property.getInitializerIfKind(SyntaxKind.ShorthandPropertyAssignment)

        if (initializer && initializer.isKind(SyntaxKind.StringLiteral) && initializer.getLiteralText() !== value) {
          // You might want to log a warning or throw an error here if overwriting is not desired
          console.warn(`Value for key '${key}' already exists and will not be overwritten. Existing: '${initializer.getLiteralText()}', New: '${value}'`)
        }
        else if (!initializer) {
          // Handle cases where the property exists but has no initializer (e.g., `key: undefined`)
          property.setInitializer(`'${value}'`)
        }
      }
    }
    else {
      // Not the last key, so navigate or create a nested object
      if (property && property.isKind(SyntaxKind.PropertyAssignment)) {
        const initializer = property.getInitializer()

        if (initializer && initializer.isKind(SyntaxKind.ObjectLiteralExpression)) {
          currentObject = initializer // Navigate to the existing nested object
        }
        else {
          // If property exists but is not an object literal, it's a conflict
          return
        }
      }
      else if (!property) {
        // Property doesn't exist, create a new nested object
        const newObject = currentObject.addPropertyAssignment({
          name: currentKey,
          initializer: '{}',
        }).getInitializerIfKindOrThrow(SyntaxKind.ObjectLiteralExpression)

        currentObject = newObject
      }
      else {
        // This case handles existing properties that are not PropertyAssignment (e.g., ShorthandPropertyAssignment)
        return
      }
    }
  }

  // Save the changes to the file
  await testIdFile.save()
}
