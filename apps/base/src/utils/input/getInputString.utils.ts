import { getGetInputStringAbstraction } from '#abstractions/getInputString.abstraction.ts'

export interface InputStringOptions {
  title: string
  canBeEmpty?: boolean
  prompt: string
}
export async function getInputString({
  title,
  canBeEmpty,
  prompt,
}: InputStringOptions): Promise<string> {
  return await getGetInputStringAbstraction()({
    title,
    canBeEmpty,
    prompt,
  })
}
