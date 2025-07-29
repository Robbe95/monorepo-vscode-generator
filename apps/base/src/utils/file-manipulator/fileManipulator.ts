import type { SourceFile } from 'ts-morph'

import { createEmptyFile } from '#utils/files/createEmptyFile.utils.ts'
import { skipFile } from '#utils/try-catch/skipFile.ts'
import { tryCatch } from '#utils/try-catch/tryCatch.utils.ts'
import { getSourceFileOrNull } from '#utils/ts-morph/getTsSourceFile.utils.ts'

import type { ManipulateClassOptions } from './manipulations/manipulateClass'
import { manipulateClass } from './manipulations/manipulateClass'
import type { ManipulateClassMethodOptions } from './manipulations/manipulateClassMethod'
import { manipulateClassMethod } from './manipulations/manipulateClassMethod'
import type { ManipulateFunctionOptions } from './manipulations/manipulateFunction'
import { manipulateFunction } from './manipulations/manipulateFunction'
import type { ManipulateImportOptions } from './manipulations/manipulateImport'
import { manipulateImport } from './manipulations/manipulateImport'
import type { ManipulateInterfaceOptions } from './manipulations/manipulateInterface'
import { manipulateInterface } from './manipulations/manipulateInterface'
import type { ManipulateStatementOptions } from './manipulations/manipulateStatement'
import { manipulateStatement } from './manipulations/manipulateStatement'
import type { ManipulateType } from './manipulations/manipulateType'
import { manipulateType } from './manipulations/manipulateType'
import type { ManipulateVariableOptions } from './manipulations/manipulateVariable'
import { manipulateVariable } from './manipulations/manipulateVariable'

export interface FileManipulatorFromFileOptions {
  file: SourceFile
}

export interface FileManipulatorFromPathOptions {
  name: string
  projectPath: string
  path: string
}

async function initializeFromPath(options: FileManipulatorFromPathOptions) {
  const {
    name,
    projectPath,
    path,
  } = options

  const existingSourceFile = await getSourceFileOrNull({
    filePath: `${path}/${name}`,
    projectPath,
  })

  if (existingSourceFile) {
    return existingSourceFile
  }

  const sourceFileResponse = await tryCatch(createEmptyFile({
    name,
    projectPath,
    path,
  }))

  if (sourceFileResponse.error) {
    await skipFile({
      name,
      path,
    })

    return
  }

  return sourceFileResponse.data
}

export class FileManipulator {
  private file: SourceFile

  private constructor(options: FileManipulatorFromFileOptions) {
    this.file = options.file
  }

  static async create(options: FileManipulatorFromFileOptions | FileManipulatorFromPathOptions) {
    if ('file' in options) {
      return new FileManipulator(options)
    }

    const sourceFile = await initializeFromPath(options)

    if (!sourceFile) {
      throw new Error(`Failed to create file manipulator for ${options.name} at ${options.path}`)
    }

    return new FileManipulator({
      file: sourceFile,
    })
  }

  addClass(options: Omit<ManipulateClassOptions, 'file'>) {
    this.file = manipulateClass({
      ...options,
      file: this.file,
    })

    return this
  }

  addClassMethod(options: Omit<ManipulateClassMethodOptions, 'file'> & { nameClass: string }) {
    this.file = manipulateClassMethod({
      ...options,
      file: this.file,
    })

    return this
  }

  addFunction(options: Omit<ManipulateFunctionOptions, 'file'>) {
    this.file = manipulateFunction({
      ...options,
      file: this.file,
    })

    return this
  }

  addImport(options: Omit<ManipulateImportOptions, 'file'>) {
    manipulateImport({
      ...options,
      file: this.file,
    })

    return this
  }

  addInterface(options: Omit<ManipulateInterfaceOptions, 'file'>) {
    this.file = manipulateInterface({
      ...options,
      file: this.file,
    })

    return this
  }

  addStatement(options: Omit<ManipulateStatementOptions, 'file'>) {
    this.file = manipulateStatement({
      ...options,
      file: this.file,
    })

    return this
  }

  addType(options: Omit<ManipulateType, 'file'>) {
    this.file = manipulateType({
      ...options,
      file: this.file,
    })

    return this
  }

  addVariable(options: Omit<ManipulateVariableOptions, 'file'>) {
    this.file = manipulateVariable({
      ...options,
      file: this.file,
    })

    return this
  }

  getFile() {
    return this.file
  }

  save() {
    this.file.saveSync()

    return this
  }
}
