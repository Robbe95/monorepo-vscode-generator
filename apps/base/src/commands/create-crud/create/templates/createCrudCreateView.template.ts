import { getCreateCrudCreateFormFile } from '#commands/create-crud/create/createCrudCreate.files.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { toVueImport } from '#utils/files/toVueImport.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getCreateCrudCreateViewTemplate(entityName: EntityCasing) {
  const createFormFile = getCreateCrudCreateFormFile(entityName)

  await addTranslation({
    key: `module.${entityName.snakeCase}.create.title`,
    value: `Create ${entityName.humanReadable}`,
  })

  return `<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import PageLayout from '@/components/layout/PageLayout.vue'
${toVueImport(createFormFile)}

const i18n = useI18n()
</script>

<template>
  <PageLayout :title="i18n.t('module.${entityName.snakeCase}.create.title')">
    <${entityName.pascalCase}CreateForm />
  </PageLayout>
</template>
`
}
