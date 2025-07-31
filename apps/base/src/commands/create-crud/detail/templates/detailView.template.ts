import { getCreateCrudDetailModelFile } from '#commands/create-crud/detail/createCrudDetail.files.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { toTsImport } from '#utils/files/toTsImport.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { addTestId } from '#utils/test-id/addTestId.utils.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getDetailViewTemplate({
  entityName,
}: {
  entityName: EntityCasing
}) {
  await addTranslation({
    key: `module.${entityName.snakeCase}.unknown`,
    value: `Unknown ${entityName.humanReadable}`,
  })

  await addTranslation({
    key: `module.${entityName.snakeCase}.detail_title`,
    value: `${entityName.humanReadable} detail`,
  })

  await addTranslation({
    key: `module.${entityName.snakeCase}.uuid`,
    value: `${entityName.humanReadable} UUID`,
  })

  await addTranslation({
    key: `module.${entityName.snakeCase}.detail.edit_${entityName.snakeCase}`,
    value: `Edit ${entityName.humanReadable}`,
  })

  addTestId({
    key: `${toPlural(entityName.upperCase)}.DETAIL.EDIT_BUTTON`,
    value: `${entityName.kebabCase}-detail-edit-button`,
  })

  const detailModelImport = toTsImport({
    ...getCreateCrudDetailModelFile(entityName),
    isType: true,
    methodNames: [
      `${entityName.pascalCase}Detail`,
    ],
  })

  return `
  <script setup lang="ts">
import { VcRouterLinkButton } from '@wisemen/vue-core-components'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import AppPage from '@/components/layout/AppPage.vue'
import { TEST_ID } from '@/constants/testId.constant'
${detailModelImport}

const props = defineProps<{
  ${entityName.camelCase}: ${entityName.pascalCase}Detail
}>()

const i18n = useI18n()

const isEditButtonVisible = computed<boolean>(() => {
  // TODO: Implement permission check for edit button visibility
  return true
})
</script>

<template>
  <AppPage :title="i18n.t('module.${entityName.snakeCase}.unknown')">
    <template #actions>
      <VcRouterLinkButton
        v-if="isEditButtonVisible"
        :to="{
          name: '${entityName.camelCase}-update',
          params: {
            ${entityName.camelCase}Uuid: props.${entityName.camelCase}.uuid,
          },
        }"
        :data-test-id='TEST_ID.${toPlural(entityName.upperCase)}.DETAIL.EDIT_BUTTON'
      >
        {{ i18n.t('module.${entityName.snakeCase}.detail.edit_${entityName.snakeCase}') }}
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
          {{ i18n.t('module.${entityName.snakeCase}.detail_title') }}
        </h2>
        <div class="space-y-2">
          <div>
            <span class="font-medium">{{ i18n.t('module.${entityName.snakeCase}.uuid') }}</span>
            <span class="ml-2">{{ ${entityName.camelCase}.uuid ?? '-' }}</span>
          </div>
        </div>
      </div>
    </div>
  </AppPage>
</template>
`
}
