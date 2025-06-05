import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'

export function getIndexViewTemplate(entityName: string): string {
  const kebabCase = CaseTransformer.toKebabCase(entityName)
  const pascalCase = CaseTransformer.toPascalCase(entityName)
  const camelCase = CaseTransformer.toCamelCase(entityName)
  const upperCase = CaseTransformer.toUpperCase(entityName)

  const template = `
  <script setup lang="ts">
import {
  usePagination,
  VcRouterLinkButton,
} from '@wisemen/vue-core-components'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { Permission } from '@/client'
import AppErrorState from '@/components/app/error-state/AppErrorState.vue'
import AppPaginationSearchField from '@/components/app/search/AppPaginationSearchField.vue'
import AppPage from '@/components/layout/AppPage.vue'
import { useDocumentTitle } from '@/composables/document-title/documentTitle.composable'
import { TEST_ID } from '@/constants/testId.constant.ts'
import type { ${pascalCase}IndexQueryOptions } from @/models/${kebabCase}/index/${camelCase}IndexQueryOptions.model
import { use${pascalCase}IndexQuery } from '@/modules/${kebabCase}/api/queries/${camelCase}Index.query'
import ${pascalCase}OverviewTable from '@/modules/${kebabCase}/features/overview/components/${pascalCase}OverviewTable.vue'
import { useAuthStore } from '@/stores/auth.store'

const i18n = useI18n()
const authStore = useAuthStore()

const documentTitle = useDocumentTitle()

documentTitle.set(i18n.t('module.${camelCase}.label.plural'))

const pagination = usePagination<${pascalCase}IndexQueryOptions>({
  isRouteQueryEnabled: true,
  key: '${camelCase}Index',
})

const ${camelCase}IndexQuery = use${pascalCase}IndexQuery(pagination.paginationOptions)

const isLoading = computed<boolean>(() => ${camelCase}IndexQuery.isLoading.value)
const error = computed<unknown>(() => ${camelCase}IndexQuery.error.value)
const isCreateButtonVisible = computed<boolean>(() => authStore.hasPermission(Permission.${upperCase}_CREATE))
</script>

<template>
  <AppPage :title="i18n.t('module.${camelCase}.label.plural')">
    <template #actions>
      <VcRouterLinkButton
        v-if="isCreateButtonVisible"
        :to="{ name: '${kebabCase}-create' }"
        :test-id="TEST_ID.CONTACTS.OVERVIEW.CREATE_BUTTON"
        color="primary"
        icon-left="plus"
      >
        {{ i18n.t('module.${camelCase}.create') }}
      </VcRouterLinkButton>
    </template>

    <template #default>
      <div
        v-if="error !== null"
        class="flex size-full flex-1 items-center justify-center"
      >
        <AppErrorState :error="error" />
      </div>

      <div
        v-else
        class="flex flex-1 flex-col gap-lg"
      >
        <AppPaginationSearchField
          :is-loading="${camelCase}IndexQuery.isLoading.value"
          :pagination="pagination"
        />

        <${pascalCase}OverviewTable
          :data="${camelCase}IndexQuery.data.value"
          :is-loading="isLoading"
          :pagination="pagination"
          :error="${camelCase}IndexQuery.error.value"
        />
      </div>
    </template>
  </AppPage>
</template>
`

  return template
}
