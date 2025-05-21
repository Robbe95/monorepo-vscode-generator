import { plural } from 'pluralize'

export function toPlural(str: string) {
  return plural(str)
}
