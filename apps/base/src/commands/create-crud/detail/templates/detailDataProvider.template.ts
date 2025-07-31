import {
  getCreateCrudDetailApiQueryFile,
  getCreateCrudDetailViewFile,
} from '#commands/create-crud/detail/createCrudDetail.files.ts'
import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { toTsImport } from '#utils/files/toTsImport.ts'
import { toVueImport } from '#utils/files/toVueImport.ts'

export function getDetailDataProviderTemplate({
  entityName,
}: {
  entityName: EntityCasing
}): string {
  const uuidImport = toTsImport(
    {
      ...getCreateCrudUuidModelFile(entityName),
      isType: true,
      methodNames: [
        `${entityName.pascalCase}Uuid`,
      ],
    },
  )

  const detailQueryImport = toTsImport({
    ...getCreateCrudDetailApiQueryFile(entityName),
    methodNames: [
      `use${entityName.pascalCase}DetailQuery`,
    ],
  })

  const detailViewImport = toVueImport(getCreateCrudDetailViewFile(entityName))

  return `
  <script setup lang="ts">
import { computed } from 'vue'

import AppDataProviderView from '@/components/app/AppDataProviderView.vue'
${uuidImport}
${detailQueryImport}
${detailViewImport}

const props = defineProps<{
  ${entityName.camelCase}Uuid: ${entityName.pascalCase}Uuid
}>()

const ${entityName.camelCase}DetailQuery = use${entityName.pascalCase}DetailQuery(computed<${entityName.pascalCase}Uuid>(() => props.${entityName.camelCase}Uuid))
</script>

<template>
  <AppDataProviderView
    :queries="{
      ${entityName.camelCase}: ${entityName.camelCase}DetailQuery,
    }"
  >
    <template #default="{ data }">
      <${entityName.pascalCase}DetailView :${entityName.camelCase}="data.${entityName.camelCase}" />
    </template>
  </AppDataProviderView>
</template>

`
}
