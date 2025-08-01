import {
  getCreateCrudIndexModelFile,
  getCreateCrudIndexQueryOptionsModelFile,
} from '#commands/create-crud/index/createCrudIndex.files.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { toTsImport } from '#utils/files/toTsImport.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { addTestId } from '#utils/test-id/addTestId.utils.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getIndexTableTemplate(entityName: EntityCasing) {
  await addTranslation({
    key: `module.${entityName.snakeCase}.uuid`,
    value: `${entityName.humanReadable} UUID`,
  })

  addTestId({
    key: `${toPlural(entityName.upperCase)}.TABLE.NAME_LINK`,
    value: `${entityName.kebabCase}-overview-table-name-link`,
  })
  addTestId({
    key: `${toPlural(entityName.upperCase)}.TABLE.CONTAINER`,
    value: `${entityName.kebabCase}-overview-table-container`,
  })

  const indexModelImport = toTsImport({
    methodNames: [
      `${entityName.pascalCase}Index`,
    ],
    ...getCreateCrudIndexModelFile(entityName),
    isType: true,
  })

  const indexQueryOptionsModelImport = toTsImport({
    methodNames: [
      `${entityName.pascalCase}IndexQueryOptions`,
    ],
    ...getCreateCrudIndexQueryOptionsModelFile(entityName),
    isType: true,
  })

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
${indexModelImport}
${indexQueryOptionsModelImport}
import ${entityName.pascalCase}OverviewTableNameCell from '@/modules/${entityName.kebabCase}/features/overview/components/${entityName.pascalCase}OverviewTableNameCell.vue'

const props = defineProps<{
  isLoading: boolean
  data: PaginatedData<${entityName.pascalCase}Index> | null
  error: unknown | null
  pagination: Pagination<${entityName.pascalCase}IndexQueryOptions>
}>()

const i18n = useI18n()

const columns = computed<TableColumn<${entityName.pascalCase}Index>[]>(() => [
  {
    testId: TEST_ID.${toPlural(entityName.upperCase)}.TABLE.NAME_LINK,
    isSortable: true,
    cell: (${entityName.camelCase}): VNode => h(VcTableCell, {
      ${entityName.camelCase},
    }),
    headerLabel: i18n.t('module.${entityName.snakeCase}.uuid'),
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
    :data-test-id="TEST_ID.${toPlural(entityName.upperCase)}.TABLE.CONTAINER"
    :is-first-column-sticky="true"
    :is-loading="props.isLoading"
    :pagination="props.pagination"
  />
</template>
`

  return template
}
