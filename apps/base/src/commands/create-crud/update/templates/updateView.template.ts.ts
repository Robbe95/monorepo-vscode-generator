import { getCreateCrudDetailModelFile } from '#commands/create-crud/detail/createCrudDetail.files.ts'
import { getCreateCrudUpdateFormFile } from '#commands/create-crud/update/createCrudUpdate.files.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { toTsImport } from '#utils/files/toTsImport.ts'
import { toVueImport } from '#utils/files/toVueImport.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getUpdateViewTemplate(entityName: EntityCasing) {
  await addTranslation({
    key: `module.${entityName.snakeCase}.update.title`,
    value: `Update ${entityName.humanReadable}`,
  })

  const updateFormImport = toVueImport(getCreateCrudUpdateFormFile(entityName))
  const detailModelImport = toTsImport({
    ...getCreateCrudDetailModelFile(entityName),
    isType: true,
    methodNames: [
      `${entityName.pascalCase}Detail`,
    ],
  })

  return `
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import PageLayout from '@/components/layout/PageLayout.vue'
${updateFormImport}
${detailModelImport}

const props = defineProps<{
  ${entityName.camelCase}: ${entityName.pascalCase}Detail
}>()

const i18n = useI18n()
</script>

<template>
  <PageLayout :title="i18n.t('module.${entityName.camelCase}.update.title')">
    <${entityName.pascalCase}UpdateForm :${entityName.camelCase}="props.${entityName.camelCase}" />
  </PageLayout>
</template>

`
}
