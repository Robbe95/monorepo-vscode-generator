import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { addTestId } from '#utils/test-id/addTestId.utils.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getIndexViewTemplate(entityName: EntityCasing): Promise<string> {
  await addTranslation({
    key: `module.${entityName.camelCase}.label.plural`,
    value: `${toPlural(entityName.humanReadable)}`,
  })

  await addTranslation({
    key: `module.${entityName.camelCase}.create`,
    value: `Create ${entityName.humanReadable}`,
  })

  addTestId({
    key: `${toPlural(entityName.upperCase)}.OVERVIEW.CREATE_BUTTON`,
    value: `${entityName.kebabCase}-overview-create-button`,
  })

  const template = `
  <script setup lang="ts">
import {
  usePagination,
  VcRouterLinkButton,
} from '@wisemen/vue-core-components'
import { useI18n } from 'vue-i18n'

import PageLayout from '@/components/layout/PageLayout.vue'
import PaginationSearchField from '@/components/pagination/PaginationSearchField.vue'
import TableErrorState from '@/components/table/TableErrorState.vue'
import { useDocumentTitle } from '@/composables/document-title/documentTitle.composable'
import { TEST_ID } from '@/constants/testId.constant.ts'
import type { ${entityName.pascalCase}IndexPagination } from '@/models/${entityName.kebabCase}/index/${entityName.camelCase}IndexPagination.model'
import { use${entityName.pascalCase}IndexQuery } from '@/modules/${entityName.kebabCase}/api/queries/${entityName.camelCase}Index.query'
import ${entityName.pascalCase}OverviewTable from '@/modules/${entityName.kebabCase}/features/overview/components/${entityName.pascalCase}OverviewTable.vue'

const i18n = useI18n()
const documentTitle = useDocumentTitle()

documentTitle.set(i18n.t('module.${entityName.snakeCase}.label.plural'))

const pagination = usePagination<${entityName.pascalCase}IndexPagination>({
  isRouteQueryEnabled: true,
  key: '${entityName.camelCase}Index',
})

const {
  isLoading,
  data,
  error,
} = use${entityName.pascalCase}IndexQuery(pagination.paginationOptions)
</script>

<template>
  <PageLayout
    :title="i18n.t('module.${entityName.snakeCase}.label.plural')"
    :no-content-padding="true"
  >
    <template #actions>
      <PaginationSearchField
        :is-loading="isLoading"
        :pagination="pagination"
      />

      <VcRouterLinkButton
        :to="{ name: '${entityName.kebabCase}-create' }"
        :test-id="TEST_ID.${toPlural(entityName.upperCase)}.OVERVIEW.CREATE_BUTTON"
        color="primary"
      >
        {{ i18n.t('module.${entityName.snakeCase}.create') }}
      </VcRouterLinkButton>
    </template>

    <template #default>
      <TableErrorState
        v-if="error !== null"
        :error="error"
      />

      <${entityName.pascalCase}OverviewTable
        v-else
        :data="data"
        :is-loading="isLoading"
        :pagination="pagination"
      />
    </template>
  </PageLayout>
</template>

`

  return template
}
