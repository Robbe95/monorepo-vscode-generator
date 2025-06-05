import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'

export function getIndexTableTemplate(entityName: string): string {
  const kebabCase = CaseTransformer.toKebabCase(entityName)
  const pascalCase = CaseTransformer.toPascalCase(entityName)
  const camelCase = CaseTransformer.toCamelCase(entityName)
  const upperCase = CaseTransformer.toUpperCase(entityName)
  const snakeCase = CaseTransformer.toSnakeCase(entityName)

  const template = `
  <script setup lang="ts">
import type {
  PaginatedData,
  Pagination,
  TableColumn,
} from '@wisemen/vue-core-components'
import { VcTable, VcTableCell } from '@wisemen/vue-core-components'
import type { VNode } from 'vue'
import {
  computed,
  h,
} from 'vue'
import { useI18n } from 'vue-i18n'

import AppErrorState from '@/components/app/error-state/AppErrorState.vue'
import { TEST_ID } from '@/constants/testId.constant'
import type { ${pascalCase}Index } from '@/models/${kebabCase}/index/${camelCase}Index.model'
import type { ${pascalCase}IndexQueryOptions } from '@/models/${kebabCase}/index/${camelCase}IndexQueryOptions.model'
import ${pascalCase}OverviewTableNameCell from '@/modules/${kebabCase}/features/overview/components/${pascalCase}OverviewTableNameCell.vue'

const props = defineProps<{
  isLoading: boolean
  data: PaginatedData<${pascalCase}Index> | null
  error: unknown | null
  pagination: Pagination<${pascalCase}IndexQueryOptions>
}>()

const i18n = useI18n()

const columns = computed<TableColumn<${pascalCase}Index>[]>(() => [
  {
    testId: TEST_ID.${toPlural(upperCase)}.TABLE.NAME_LINK,
    isSortable: true,
    cell: (${camelCase}): VNode => h(VcTableCell, {
      ${camelCase},
    }),
    headerLabel: i18n.t('module.${snakeCase}.uuid'),
    key: 'uuid',
  },
])
</script>

<template>
  <div
    v-if="props.error !== null"
    class="flex size-full flex-1 items-center justify-center"
  >
    <AppErrorState :error="props.error" />
  </div>

  <VcTable
    v-else
    :columns="columns"
    :data="props.data"
    :data-test-id="TEST_ID.${toPlural(upperCase)}.TABLE.CONTAINER"
    :is-first-column-sticky="true"
    :is-loading="props.isLoading"
    :pagination="props.pagination"
  />
</template>
`

  return template
}
