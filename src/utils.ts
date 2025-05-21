import { useLogger } from 'reactive-vscode'

import { displayName } from '#generated/meta.ts'

export const logger = useLogger(displayName)
