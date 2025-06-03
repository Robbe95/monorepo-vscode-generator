import type { MaybePromise } from './maybePromise'

export interface LoggerAbstraction {
  error: (message: string) => MaybePromise<void>
  info: (message: string) => MaybePromise<void>
  warn: (message: string) => MaybePromise<void>
}

let loggerAbstraction: LoggerAbstraction

export function setLoggerExtraction(logger: LoggerAbstraction) {
  loggerAbstraction = logger
}

export function getLoggerAbstraction(): LoggerAbstraction {
  if (!loggerAbstraction) {
    throw new Error('Logger abstraction is not set. Please set it using setLoggerExtraction.')
  }

  return loggerAbstraction
}
