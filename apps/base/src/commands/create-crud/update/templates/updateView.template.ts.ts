import { allCases } from '#utils/casing/caseTransformer.utils.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getUpdateViewTemplate(entityName: string) {
  const entityCasing = allCases(entityName)

  await addTranslation({
    key: `module.${entityCasing.snakeCase}.update.title`,
    value: `Update ${entityCasing.humanReadable}`,
  })

  return `
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import FormPage from '@/components/form/FormPage.vue'
import type { ${entityCasing.pascalCase}Detail } from '@/models/${entityCasing.kebabCase}/detail/${entityCasing.camelCase}Detail.model'
import ${entityCasing.pascalCase}UpdateForm from '@/modules/${entityCasing.kebabCase}/features/update/components/${entityCasing.pascalCase}UpdateForm.vue'

const props = defineProps<{
  ${entityCasing.camelCase}: ${entityCasing.pascalCase}Detail
}>()

const i18n = useI18n()
</script>

<template>
  <FormPage :title="i18n.t('module.${entityCasing.camelCase}.update.title')">
    <${entityCasing.pascalCase}UpdateForm :${entityCasing.camelCase}="props.${entityCasing.camelCase}" />
  </FormPage>
</template>

`
}
