import { getCreateCrudDetailModelFile } from '#commands/create-crud/detail/createCrudDetail.files.ts'
import {
  getCreateCrudUpdateApiMutationFile,
  getCreateCrudUpdateFormFile,
  getCreateCrudUpdateTransformerFile,
} from '#commands/create-crud/update/createCrudUpdate.files.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { toTsImport } from '#utils/files/toTsImport.ts'
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

  const updateTransformerImport = toTsImport({
    ...getCreateCrudUpdateTransformerFile(entityName),
    methodNames: [
      `${entityName.pascalCase}UpdateTransformer`,
    ],
  })

  const detailModelImport = toTsImport({
    ...getCreateCrudDetailModelFile(entityName),
    isType: true,
    methodNames: [
      `${entityName.pascalCase}Detail`,
    ],
  })

  const updateFormModelImport = toTsImport({
    ...getCreateCrudUpdateFormFile(entityName),
    methodNames: [
      `${entityName.pascalCase}UpdateFormSchema`,
    ],
  })

  const updateMutationFileImport = toTsImport({
    ...getCreateCrudUpdateApiMutationFile(entityName),
    methodNames: [
      `use${entityName.pascalCase}UpdateMutation`,
    ],
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

import AppTeleport from '@/components/app/teleport/AppTeleport.vue'
import FormRoot from '@/components/form/FormRoot.vue'
import FormFieldset from '@/components/form/FormFieldset.vue'
import FormLayout from '@/components/form/FormLayout.vue'
import FormSubmitButton from '@/components/form/FormSubmitButton.vue'
import { useApiErrorToast } from '@/composables/api-error-toast/apiErrorToast.composable'
import { TEST_ID } from '@/constants/testId.constant'
${updateTransformerImport}
${detailModelImport}
${updateFormModelImport}
${updateMutationFileImport}
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
  <FormRoot :form="form">
      <AppTeleport to="headerActions">
        <FormSubmitButton
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
  </FormRoot>
</template>
`
}
