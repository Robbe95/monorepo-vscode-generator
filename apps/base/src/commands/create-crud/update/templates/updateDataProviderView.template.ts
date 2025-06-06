import { allCases } from '#utils/casing/caseTransformer.utils.ts'

export function getUpdateDataProviderViewFile(entityName: string) {
  const entityCasing = allCases(entityName)

  return `
    <script setup lang="ts">
    import { computed } from 'vue'

    import AppDataProviderView from '@/components/app/AppDataProviderView.vue'
    import type { ${entityCasing.pascalCase}Uuid } from '@/models/${entityCasing.kebabCase}/${entityCasing.camelCase}Uuid.model'
    import { use${entityCasing.pascalCase}DetailQuery } from '@/modules/${entityCasing.kebabCase}/api/queries/${entityCasing.camelCase}Detail.query'
    import ${entityCasing.pascalCase}UpdateView from '@/modules/${entityCasing.kebabCase}/features/update/views/${entityCasing.pascalCase}UpdateView.vue'

    const props = defineProps<{
      ${entityCasing.camelCase}Uuid: ${entityCasing.pascalCase}Uuid
    }>()

    const ${entityCasing.camelCase}DetailQuery = use${entityCasing.pascalCase}DetailQuery(computed<${entityCasing.pascalCase}Uuid>(() => props.${entityCasing.camelCase}Uuid))
    </script>

    <template>
      <AppDataProviderView
        :queries="{
          ${entityCasing.camelCase}: ${entityCasing.camelCase}DetailQuery,
        }"
      >
        <template #default="{ data }">
          <${entityCasing.pascalCase}UpdateView :${entityCasing.camelCase}="data.${entityCasing.camelCase}" />
        </template>
      </AppDataProviderView>
    </template>
`
}
