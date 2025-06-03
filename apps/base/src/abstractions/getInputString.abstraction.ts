import type { InputStringOptions } from '#utils/input/getInputString.utils.ts'

import type { MaybePromise } from './maybePromise'

export type GetInputStringAbstraction = (input: InputStringOptions) => MaybePromise<string>

let getInputStringAbstraction: GetInputStringAbstraction

export function setGetInputStringAbstraction(setGetInputStringAbstraction: GetInputStringAbstraction) {
  getInputStringAbstraction = setGetInputStringAbstraction
}

export function getGetInputStringAbstraction(): GetInputStringAbstraction {
  if (!getInputStringAbstraction) {
    throw new Error('getInputStringAbstraction is not set. Please set it using setGetInputStringAbstraction.')
  }

  return getInputStringAbstraction
}
