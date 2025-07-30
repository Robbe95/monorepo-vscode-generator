import { getCreateCrudCreateFormFile } from '#commands/create-crud/create/createCrudCreate.files.ts'
import { allCases } from '#utils/casing/caseTransformer.utils.ts'
import { toVueImport } from '#utils/files/toVueImport.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getCreateCrudCreateViewTemplate(entityName: string) {
  const entityCasing = allCases(entityName)
  const createFormFile = getCreateCrudCreateFormFile(entityName)

  await addTranslation({
    key: `module.${entityCasing.snakeCase}.create.title`,
    value: `Create ${entityCasing.humanReadable}`,
  })

  return `<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import PageLayout from '@/components/layout/PageLayout.vue'
${toVueImport(createFormFile)}

const i18n = useI18n()
</script>

<template>
  <PageLayout :title="i18n.t('module.${entityCasing.snakeCase}.create.title')">
    <${entityCasing.pascalCase}CreateForm />
  </PageLayout>
</template>
`
}
