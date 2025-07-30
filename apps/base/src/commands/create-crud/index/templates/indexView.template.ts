import {
  allCases,
  CaseTransformer,
} from '#utils/casing/caseTransformer.utils.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { addTestId } from '#utils/test-id/addTestId.utils.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getIndexViewTemplate(entityName: string): Promise<string> {
  const {
    camelCase,
    humanReadable,
    kebabCase,
    pascalCase,
    snakeCase,
    upperCase,
  } = allCases(entityName)

  await addTranslation({
    key: `module.${camelCase}.label.plural`,
    value: `${CaseTransformer.toHumanReadable(toPlural(entityName))}`,
  })

  await addTranslation({
    key: `module.${camelCase}.create`,
    value: `Create ${humanReadable}`,
  })

  addTestId({
    key: `${toPlural(upperCase)}.OVERVIEW.CREATE_BUTTON`,
    value: `${kebabCase}-overview-create-button`,
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
import type { ${pascalCase}IndexPagination } from '@/models/${kebabCase}/index/${camelCase}IndexPagination.model'
import { use${pascalCase}IndexQuery } from '@/modules/${kebabCase}/api/queries/${camelCase}Index.query'
import ${pascalCase}OverviewTable from '@/modules/${kebabCase}/features/overview/components/${pascalCase}OverviewTable.vue'

const i18n = useI18n()
const documentTitle = useDocumentTitle()

documentTitle.set(i18n.t('module.${snakeCase}.label.plural'))

const pagination = usePagination<${pascalCase}IndexPagination>({
  isRouteQueryEnabled: true,
  key: '${camelCase}Index',
})

const {
  isLoading,
  data,
  error,
} = use${pascalCase}IndexQuery(pagination.paginationOptions)
</script>

<template>
  <PageLayout
    :title="i18n.t('module.${snakeCase}.label.plural')"
    :no-content-padding="true"
  >
    <template #actions>
      <PaginationSearchField
        :is-loading="isLoading"
        :pagination="pagination"
      />

      <VcRouterLinkButton
        :to="{ name: '${kebabCase}-create' }"
        :test-id="TEST_ID.${toPlural(upperCase)}.OVERVIEW.CREATE_BUTTON"
        color="primary"
      >
        {{ i18n.t('module.${snakeCase}.create') }}
      </VcRouterLinkButton>
    </template>

    <template #default>
      <TableErrorState
        v-if="error !== null"
        :error="error"
      />

      <${pascalCase}OverviewTable
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
