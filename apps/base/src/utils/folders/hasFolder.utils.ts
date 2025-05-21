import fs from 'node:fs'

export function hasFolder(folderPath: string): boolean {
  return fs.existsSync(folderPath)
}
