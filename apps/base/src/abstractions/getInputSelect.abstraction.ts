import type { MaybePromise } from './maybePromise'

export interface InputSelectOptions {
  title: string
  options: {
    description: string
    label: string
  }[]
  placeholder: string
}

export type GetInputSelectAbstraction = (input: InputSelectOptions) => MaybePromise<string>

let getInputSelectAbstraction: GetInputSelectAbstraction

export function setGetInputSelectAbstraction(setGetInputSelectAbstraction: GetInputSelectAbstraction) {
  getInputSelectAbstraction = setGetInputSelectAbstraction
}

export function getGetInputSelectAbstraction(): GetInputSelectAbstraction {
  if (!getInputSelectAbstraction) {
    throw new Error('getInputSelectAbstraction is not set. Please set it using setGetInputSelectAbstraction.')
  }

  return getInputSelectAbstraction
}
