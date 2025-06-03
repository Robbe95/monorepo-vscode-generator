import { getGetRootFolderAbstraction } from '#abstractions/getRootFolder.abstraction.ts'

export async function getRootFolder() {
  return await getGetRootFolderAbstraction()()
}

export function getPayloadRootFolder() {
  const rootFolder = getRootFolder()
  const payloadRootFolder = `${rootFolder}/apps/payload`

  return payloadRootFolder
}
