import fs from 'node:fs'
import path from 'node:path'

interface Folder {
  name: string
  subfolders: Folder[]
  path: string
}
export async function getFolders(folderPath: string): Promise<Folder[]> {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, {
      recursive: true,
    })
  }
  if (!fs.statSync(folderPath).isDirectory()) {
    throw new Error(`Path ${folderPath} is not a directory`)
  }
  if (folderPath === path.resolve('.')) {
    throw new Error('Path is the root directory')
  }
  const folders: Folder[] = []
  const items = fs.readdirSync(folderPath)

  for (const item of items) {
    const itemPath = path.join(folderPath, item)
    const stats = fs.statSync(itemPath)

    if (stats.isDirectory()) {
      const subfolders = await getFolders(itemPath)

      folders.push({
        name: item,
        subfolders,
        path: itemPath,
      })
    }
  }

  return Promise.resolve(folders)
}
