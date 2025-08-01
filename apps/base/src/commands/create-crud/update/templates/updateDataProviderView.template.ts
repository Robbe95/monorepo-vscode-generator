import { getCreateCrudDetailApiQueryFile } from '#commands/create-crud/detail/createCrudDetail.files.ts'
import { getCreateCrudUpdateViewFile } from '#commands/create-crud/update/createCrudUpdate.files.ts'
import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { toTsImport } from '#utils/files/toTsImport.ts'
import { toVueImport } from '#utils/files/toVueImport.ts'

export function getUpdateDataProviderViewFile(entityName: EntityCasing) {
  const uuidModelImport = toTsImport({
    ...getCreateCrudUuidModelFile(entityName),
    methodNames: [
      `${entityName.pascalCase}Uuid`,
    ],
  })

  const detailQueryImport = toTsImport({
    ...getCreateCrudDetailApiQueryFile(entityName),
    methodNames: [
      `use${entityName.pascalCase}DetailQuery`,
    ],
  })

  const detailUpdateImport = toVueImport(getCreateCrudUpdateViewFile(entityName))

  return `
    <script setup lang="ts">
    import { computed } from 'vue'

    import AppDataProviderView from '@/components/app/AppDataProviderView.vue'
    ${uuidModelImport}
    ${detailQueryImport}
    ${detailUpdateImport}

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
          <${entityName.pascalCase}UpdateView :${entityName.camelCase}="data.${entityName.camelCase}" />
        </template>
      </AppDataProviderView>
    </template>
`
}
