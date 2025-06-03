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
  const sourceFile = project.getSourceFile(`${rootFolder}/${projectPath}/${convertedFilePath}`)

  if (!sourceFile) {
    throw new Error(`Source file not found: ${filePath}`)
  }

  return sourceFile
}
