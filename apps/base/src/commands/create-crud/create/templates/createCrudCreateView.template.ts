import { allCases } from '#utils/casing/caseTransformer.utils.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export function getCreateCrudCreateViewTemplate(entityName: string) {
  const entityCasing = allCases(entityName)

  addTranslation({
    key: `module.${entityCasing.snakeCase}.create.title`,
    value: `Create ${entityCasing.humanReadable}`,
  })

  return `<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import FormPage from '@/components/form/FormPage.vue'
import ${entityCasing.pascalCase}CreateForm from '@/modules/${entityCasing.kebabCase}/features/create/components/${entityCasing.pascalCase}CreateForm.vue'

const i18n = useI18n()
</script>

<template>
  <FormPage :title="i18n.t('module.${entityCasing.snakeCase}.create.title')">
    <${entityCasing.pascalCase}CreateForm />
  </FormPage>
</template>
`
}
