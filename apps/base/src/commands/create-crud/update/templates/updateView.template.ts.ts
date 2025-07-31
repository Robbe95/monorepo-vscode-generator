import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getUpdateViewTemplate(entityName: EntityCasing) {
  await addTranslation({
    key: `module.${entityName.snakeCase}.update.title`,
    value: `Update ${entityName.humanReadable}`,
  })

  return `
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import FormPage from '@/components/form/FormPage.vue'
import type { ${entityName.pascalCase}Detail } from '@/models/${entityName.kebabCase}/detail/${entityName.camelCase}Detail.model'
import ${entityName.pascalCase}UpdateForm from '@/modules/${entityName.kebabCase}/features/update/components/${entityName.pascalCase}UpdateForm.vue'

const props = defineProps<{
  ${entityName.camelCase}: ${entityName.pascalCase}Detail
}>()

const i18n = useI18n()
</script>

<template>
  <FormPage :title="i18n.t('module.${entityName.camelCase}.update.title')">
    <${entityName.pascalCase}UpdateForm :${entityName.camelCase}="props.${entityName.camelCase}" />
  </FormPage>
</template>

`
}
