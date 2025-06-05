import type { MaybePromise } from './maybePromise'

export interface InputSelectOptions<TMulti extends boolean> {
  title: string
  canSelectMultiple?: TMulti
  canTypeValue?: boolean
  options: {
    description: string
    initialPicked?: boolean
    label: string
  }[]
  placeholder: string

}

export type GetInputSelectAbstraction<TMulti extends boolean> = (input: InputSelectOptions<TMulti>) =>
MaybePromise<TMulti extends (false) ? string : string[]>

let getInputSelectAbstraction: GetInputSelectAbstraction<boolean>

export function setGetInputSelectAbstraction(setGetInputSelectAbstraction: GetInputSelectAbstraction<boolean>) {
  getInputSelectAbstraction = setGetInputSelectAbstraction
}

export function getGetInputSelectAbstraction<TMulti extends boolean>(): GetInputSelectAbstraction<TMulti> {
  if (!getInputSelectAbstraction) {
    throw new Error('getInputSelectAbstraction is not set. Please set it using setGetInputSelectAbstraction.')
  }

  return getInputSelectAbstraction
}
