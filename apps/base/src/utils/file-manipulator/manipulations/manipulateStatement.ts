import type { SourceFile } from 'ts-morph'

export interface ManipulateStatementOptions {
  file: SourceFile
  statement: string
}
export function manipulateStatement({
  file, statement,
}: ManipulateStatementOptions) {
  file.addStatements(statement)

  return file
}
