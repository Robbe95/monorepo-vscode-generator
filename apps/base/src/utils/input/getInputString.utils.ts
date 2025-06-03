import { getGetInputStringAbstraction } from '#abstractions/getInputString.abstraction.ts'

export interface InputStringOptions {
  title: string
  prompt: string
}
export async function getInputString({
  title, prompt,
}: InputStringOptions): Promise<string> {
  return await getGetInputStringAbstraction()({
    title,
    prompt,
  })
}
