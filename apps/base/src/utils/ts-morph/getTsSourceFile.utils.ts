import { getRootFolder } from '#utils/folders/getRootFolder.utils.ts'
import { getTsProject } from '#utils/ts-morph/getTsProject.utils.ts'

export async function getTsSourceFile({
  filePath, projectPath,
}: {
  filePath: string
  projectPath: string
}) {
  const project = await getTsProject(projectPath)
  const rootFolder = await getRootFolder()
  const convertedFilePath = filePath.replace(`${projectPath}/`, '')
  const fullPath = `${rootFolder}/${projectPath}/${convertedFilePath}`.replaceAll('//', '/')
  const sourceFile = project.getSourceFile(`${fullPath}`)

  if (!sourceFile) {
    throw new Error(`Source file not found: ${fullPath}`)
  }

  return sourceFile
}



export async function getSourceFileOrNull({
  filePath, projectPath,
}: {
  filePath: string
  projectPath: string
}) {
  const project = await getTsProject(projectPath)
  const rootFolder = await getRootFolder()
  const convertedFilePath = filePath.replace(`${projectPath}/`, '')
  const fullPath = `${rootFolder}/${projectPath}/${convertedFilePath}`.replaceAll('//', '/')
  const sourceFile = project.getSourceFile(`${fullPath}`)

  if (!sourceFile) {
    return null
  }

  return sourceFile
}
