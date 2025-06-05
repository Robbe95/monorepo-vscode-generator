import { defineConfig } from 'tsdown'

export default defineConfig({
  dts: false,
  entry: [
    'src/index.ts',
  ],
  external: [
    'vscode',
  ],
  format: [
    'cjs',
  ],

  shims: false,
  watch: [
    'src/**/*.ts',
    '../base/src/**/*.ts',
  ],
})
