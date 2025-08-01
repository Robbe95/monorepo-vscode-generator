import type { MaybePromise } from './maybePromise'

export type RunCommandAbstraction = (command: string) => MaybePromise<void>

let runCommandAbstraction: RunCommandAbstraction

export function setRunCommandAbstraction(setRunCommandAbstraction: RunCommandAbstraction) {
  runCommandAbstraction = setRunCommandAbstraction
}

export function getRunCommandAbstraction(): RunCommandAbstraction {
  if (!runCommandAbstraction) {
    throw new Error('runCommandAbstraction is not set. Please set it using setRunCommandAbstraction.')
  }

  return runCommandAbstraction
}
