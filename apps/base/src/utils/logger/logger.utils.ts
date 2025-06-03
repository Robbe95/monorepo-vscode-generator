import { getLoggerAbstraction } from '#abstractions/logger.abstraction.ts'

export function getLogger() {
  return getLoggerAbstraction()
}
