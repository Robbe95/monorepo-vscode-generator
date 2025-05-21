import { defineConfigObject } from 'reactive-vscode'

import * as Meta from '#generated/meta.ts'

export const config = defineConfigObject<Meta.ScopedConfigKeyTypeMap>(
  Meta.scopedConfigs.scope,
  Meta.scopedConfigs.defaults,
)
