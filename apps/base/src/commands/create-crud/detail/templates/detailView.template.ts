import { CaseTransformer } from '#utils/casing/caseTransformer.utils.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { addTestId } from '#utils/test-id/addTestId.utils.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export function getDetailViewTemplate({
  entityName,
}: {
  entityName: string
}): string {
  const kebabCase = CaseTransformer.toKebabCase(entityName)
  const camelCase = CaseTransformer.toCamelCase(entityName)
  const snakeCase = CaseTransformer.toSnakeCase(entityName)
  const upperCase = CaseTransformer.toUpperCase(entityName)
  const pascalCase = CaseTransformer.toPascalCase(entityName)
  const humanReadable = CaseTransformer.toHumanReadable(entityName)

  addTranslation({
    key: `module.${snakeCase}.unknown`,
    value: `Unknown ${humanReadable}`,
  })

  addTranslation({
    key: `module.${snakeCase}.detail_title`,
    value: `${humanReadable} detail`,
  })

  addTranslation({
    key: `module.${snakeCase}.uuid`,
    value: `${humanReadable} UUID`,
  })

  addTranslation({
    key: `module.${snakeCase}.detail.edit_${snakeCase}`,
    value: `Edit ${humanReadable}`,
  })

  addTestId({
    key: `${toPlural(upperCase)}.DETAIL.EDIT_BUTTON`,
    value: `${kebabCase}-detail-edit-button`,
  })

  return `
  <script setup lang="ts">
import { VcRouterLinkButton } from '@wisemen/vue-core-components'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import AppPage from '@/components/layout/AppPage.vue'
import { TEST_ID } from '@/constants/testId.constant'
import type { ${pascalCase}Detail } from '@/models/${kebabCase}/detail/${camelCase}Detail.model'

const props = defineProps<{
  ${camelCase}: ${pascalCase}Detail
}>()

const i18n = useI18n()

const isEditButtonVisible = computed<boolean>(() => {
  // TODO: Implement permission check for edit button visibility
  return true
})
</script>

<template>
  <AppPage :title="i18n.t('module.${snakeCase}.unknown')">
    <template #actions>
      <VcRouterLinkButton
        v-if="isEditButtonVisible"
        :to="{
          name: '${camelCase}-update',
          params: {
            ${camelCase}Uuid: props.${camelCase}.uuid,
          },
        }"
        :data-test-id='TEST_ID.${toPlural(upperCase)}.DETAIL.EDIT_BUTTON'
      >
        {{ i18n.t('module.${snakeCase}.detail.edit_${snakeCase}') }}
      </VcRouterLinkButton>
    </template>

    <div
      class="
        grid grid-cols-1 gap-4
        md:grid-cols-2
      "
    >
      <div
        class="
          rounded-lg border border-gray-200 p-4
          dark:border-gray-700
        "
      >
        <h2 class="mb-4 text-lg font-medium">
          {{ i18n.t('module.${snakeCase}.detail_title') }}
        </h2>
        <div class="space-y-2">
          <div>
            <span class="font-medium">{{ i18n.t('module.${snakeCase}.uuid') }}</span>
            <span class="ml-2">{{ ${camelCase}.uuid ?? '-' }}</span>
          </div>
        </div>
      </div>
    </div>
  </AppPage>
</template>
`
}
