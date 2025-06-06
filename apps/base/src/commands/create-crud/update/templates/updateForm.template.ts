import { allCases } from '#utils/casing/caseTransformer.utils.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { addTestId } from '#utils/test-id/addTestId.utils.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getUpdateFormTemplate(entityName: string) {
  const entityCasing = allCases(entityName)

  await addTranslation({
    key: `module.${entityCasing.snakeCase}.title`,
    value: `${entityCasing.humanReadable}`,
  })
  await addTranslation({
    key: `module.${entityCasing.snakeCase}.uuid`,
    value: `${entityCasing.humanReadable}`,
  })
  addTestId({
    key: `${toPlural(entityCasing.upperCase)}.FORM.UPDATE_SUBMIT_BUTTON`,
    value: `${entityCasing.kebabCase}-update-form-submit-button`,
  })

  return `
  <script setup lang="ts">
import {
  useVcToast,
  VcTextField,
} from '@wisemen/vue-core-components'
import { useForm } from 'formango'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import FormGrid from '@/components/app/grid/FormGrid.vue'
import AppTeleport from '@/components/app/teleport/AppTeleport.vue'
import AppForm from '@/components/form/AppForm.vue'
import FormFieldset from '@/components/form/FormFieldset.vue'
import FormLayout from '@/components/form/FormLayout.vue'
import FormSubmitButton from '@/components/form/FormSubmitButton.vue'
import { useApiErrorToast } from '@/composables/api-error-toast/apiErrorToast.composable'
import { TEST_ID } from '@/constants/testId.constant'
import { ${entityCasing.pascalCase}UpdateTransformer } from '@/models/${entityCasing.kebabCase}/update/${entityCasing.camelCase}Update.transformer.ts'
import type { ${entityCasing.pascalCase}Detail } from '@/models/${entityCasing.kebabCase}/detail/${entityCasing.camelCase}Detail.model'
import { ${entityCasing.camelCase}UpdateFormSchema } from '@/models/${entityCasing.kebabCase}/update/${entityCasing.camelCase}UpdateForm.model'
import { use${entityCasing.pascalCase}UpdateMutation } from '@/modules/${entityCasing.kebabCase}/api/mutations/${entityCasing.camelCase}Update.mutation'
import { toFormField } from '@/utils/formango.util'

const props = defineProps<{
  ${entityCasing.camelCase}: ${entityCasing.pascalCase}Detail
}>()

const i18n = useI18n()
const router = useRouter()
const toast = useVcToast()
const errorToast = useApiErrorToast()
const ${entityCasing.camelCase}UpdateMutation = use${entityCasing.pascalCase}UpdateMutation()

const form = useForm({
  initialState: () => ${entityCasing.pascalCase}UpdateTransformer.toForm(props.${entityCasing.camelCase}),
  schema: ${entityCasing.camelCase}UpdateFormSchema,
  onSubmit: async (values) => {
    try {
      await ${entityCasing.camelCase}UpdateMutation.execute({
        body: values,
        params: {
          ${entityCasing.camelCase}Uuid: props.${entityCasing.camelCase}.uuid,
        },
      })

      await router.push({
        name: '${entityCasing.kebabCase}-detail',
        params: {
          ${entityCasing.camelCase}Uuid: props.${entityCasing.camelCase}.uuid,
        },
      })
    }
    catch (error) {
      errorToast.show(error)
    }
  },
  onSubmitError: () => {
    toast.error({
      title: i18n.t('error.invalid_form_input.title'),
      description: i18n.t('error.invalid_form_input.description'),
    })
  },
})

const uuid = form.register('uuid')
</script>

<template>
  <AppForm :form="form">
    <template #default="{ formId }">
      <AppTeleport to="headerActions">
        <FormSubmitButton
          :form-id="formId"
          :form="form"
          :data-test-id="TEST_ID.${toPlural(entityCasing.upperCase)}.FORM.SUBMIT_BUTTON"
          :label="i18n.t('form.save_changes')"
        />
      </AppTeleport>

      <FormLayout>
        <FormFieldset
          :title="i18n.t('module.${entityCasing.snakeCase}.title')"
        >
          <FormGrid :cols="2">
            <VcTextField
              v-bind="toFormField(uuid)"
              :label="i18n.t('module.${entityCasing.snakeCase}.uuid')"
            />
          </FormGrid>
        </FormFieldset>
      </FormLayout>
    </template>
  </AppForm>
</template>
`
}
