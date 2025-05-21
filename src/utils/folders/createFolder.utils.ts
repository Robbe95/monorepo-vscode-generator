import fs from 'node:fs'

export function createFolder(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, {
      recursive: true,
    })
  }
}
