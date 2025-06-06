import { getLogger } from '#utils/logger/logger.utils.ts'

export async function skipFile({
  name, path,
}: {
  name: string
  path: string
}) {
  const logger = getLogger()

  await logger.error(
    `File ${name} already exists in path ${path}. Skipping creation...`,
  )
}
