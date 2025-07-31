import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { addTestId } from '#utils/test-id/addTestId.utils.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getUpdateFormTemplate(entityName: EntityCasing) {
  await addTranslation({
    key: `module.${entityName.snakeCase}.title`,
    value: `${entityName.humanReadable}`,
  })
  await addTranslation({
    key: `module.${entityName.snakeCase}.uuid`,
    value: `${entityName.humanReadable}`,
  })
  addTestId({
    key: `${toPlural(entityName.upperCase)}.FORM.UPDATE_SUBMIT_BUTTON`,
    value: `${entityName.kebabCase}-update-form-submit-button`,
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
import { ${entityName.pascalCase}UpdateTransformer } from '@/models/${entityName.kebabCase}/update/${entityName.camelCase}Update.transformer.ts'
import type { ${entityName.pascalCase}Detail } from '@/models/${entityName.kebabCase}/detail/${entityName.camelCase}Detail.model'
import { ${entityName.camelCase}UpdateFormSchema } from '@/models/${entityName.kebabCase}/update/${entityName.camelCase}UpdateForm.model'
import { use${entityName.pascalCase}UpdateMutation } from '@/modules/${entityName.kebabCase}/api/mutations/${entityName.camelCase}Update.mutation'
import { toFormField } from '@/utils/formango.util'

const props = defineProps<{
  ${entityName.camelCase}: ${entityName.pascalCase}Detail
}>()

const i18n = useI18n()
const router = useRouter()
const toast = useVcToast()
const errorToast = useApiErrorToast()
const ${entityName.camelCase}UpdateMutation = use${entityName.pascalCase}UpdateMutation()

const form = useForm({
  initialState: () => ${entityName.pascalCase}UpdateTransformer.toForm(props.${entityName.camelCase}),
  schema: ${entityName.camelCase}UpdateFormSchema,
  onSubmit: async (values) => {
    try {
      await ${entityName.camelCase}UpdateMutation.execute({
        body: values,
        params: {
          ${entityName.camelCase}Uuid: props.${entityName.camelCase}.uuid,
        },
      })

      await router.push({
        name: '${entityName.kebabCase}-detail',
        params: {
          ${entityName.camelCase}Uuid: props.${entityName.camelCase}.uuid,
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
          :data-test-id="TEST_ID.${toPlural(entityName.upperCase)}.FORM.SUBMIT_BUTTON"
          :label="i18n.t('form.save_changes')"
        />
      </AppTeleport>

      <FormLayout>
        <FormFieldset
          :title="i18n.t('module.${entityName.snakeCase}.title')"
        >
          <FormGrid :cols="2">
            <VcTextField
              v-bind="toFormField(uuid)"
              :label="i18n.t('module.${entityName.snakeCase}.uuid')"
            />
          </FormGrid>
        </FormFieldset>
      </FormLayout>
    </template>
  </AppForm>
</template>
`
}
