// Types for the result object with discriminated union
export interface Success<T> {
  data: T
  error: null
  state: 'success'
}

export interface Failure<E> {
  data: null
  error: E
  state: 'error'
}

type Result<T, E = Error> = Failure<E> | Success<T>

export async function tryCatch<T, E = Error>(
  promise: Promise<T>,
): Promise<Result<T, E>> {
  try {
    const data = await promise

    return {
      data,
      error: null,
      state: 'success',
    }
  }
  catch (error) {
    return {
      data: null,
      error: error as E,
      state: 'error',
    }
  }
}
