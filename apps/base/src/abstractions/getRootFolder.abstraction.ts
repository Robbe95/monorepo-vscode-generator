import type { MaybePromise } from './maybePromise'

export type GetRootFolderAbstraction = () => MaybePromise<string>

let getRootFolderAbstraction: GetRootFolderAbstraction

export function setGetRootFolderAbstraction(setGetRootFolderAbstraction: GetRootFolderAbstraction) {
  getRootFolderAbstraction = setGetRootFolderAbstraction
}

export function getGetRootFolderAbstraction(): GetRootFolderAbstraction {
  if (!getRootFolderAbstraction) {
    throw new Error('getRootFolderAbstraction is not set. Please set it using setGetRootFolderAbstraction.')
  }

  return getRootFolderAbstraction
}
