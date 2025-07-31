import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'

export function getUpdateDataProviderViewFile(entityName: EntityCasing) {
  return `
    <script setup lang="ts">
    import { computed } from 'vue'

    import AppDataProviderView from '@/components/app/AppDataProviderView.vue'
    import type { ${entityName.pascalCase}Uuid } from '@/models/${entityName.kebabCase}/${entityName.camelCase}Uuid.model'
    import { use${entityName.pascalCase}DetailQuery } from '@/modules/${entityName.kebabCase}/api/queries/${entityName.camelCase}Detail.query'
    import ${entityName.pascalCase}UpdateView from '@/modules/${entityName.kebabCase}/features/update/views/${entityName.pascalCase}UpdateView.vue'

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
