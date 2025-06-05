import type { InputSelectOptions } from '#abstractions/getInputSelect.abstraction.ts'
import { getGetInputSelectAbstraction } from '#abstractions/getInputSelect.abstraction.ts'

export async function getInputSelect<TMulti extends boolean = false>(input: InputSelectOptions<TMulti>): Promise<TMulti extends (false)  ? string : string[]> {
  return await getGetInputSelectAbstraction<TMulti>()(input)
}


