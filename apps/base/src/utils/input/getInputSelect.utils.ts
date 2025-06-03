import type { InputSelectOptions } from '#abstractions/getInputSelect.abstraction.ts'
import { getGetInputSelectAbstraction } from '#abstractions/getInputSelect.abstraction.ts'

export async function getInputSelect(input: InputSelectOptions): Promise<string> {
  return await getGetInputSelectAbstraction()(input)
}
