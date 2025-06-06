import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'

export function getDetailDataProviderTemplate({
  entityName,
}: {
  entityName: string
}): string {
  const kebabCase = CaseTransformer.toKebabCase(entityName)
  const pascalCase = CaseTransformer.toPascalCase(entityName)
  const camelCase = CaseTransformer.toCamelCase(entityName)

  return `
  <script setup lang="ts">
import { computed } from 'vue'

import AppDataProviderView from '@/components/app/AppDataProviderView.vue'
import type { ${pascalCase}Uuid } from '@/models/${kebabCase}/${camelCase}Uuid.model'
import { use${pascalCase}DetailQuery } from '@/modules/${kebabCase}/api/queries/${camelCase}Detail.query'
import ${pascalCase}DetailView from '@/modules/${camelCase}/features/detail/views/${pascalCase}DetailView.vue'

const props = defineProps<{
  ${camelCase}Uuid: ${pascalCase}Uuid
}>()

const ${camelCase}DetailQuery = use${pascalCase}DetailQuery(computed<${pascalCase}Uuid>(() => props.${camelCase}Uuid))
</script>

<template>
  <AppDataProviderView
    :queries="{
      ${camelCase}: ${camelCase}DetailQuery,
    }"
  >
    <template #default="{ data }">
      <${pascalCase}DetailView :${camelCase}="data.${camelCase}" />
    </template>
  </AppDataProviderView>
</template>

`
}
