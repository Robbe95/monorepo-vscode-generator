import {
  getCreateCrudCreateApiMutationFile,
  getCreateCrudCreateFormModelFile,
} from '#commands/create-crud/create/createCrudCreate.files.ts'
import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import { allCases } from '#utils/casing/caseTransformer.utils.ts'
import { toTsImport } from '#utils/files/toTsImport.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { addTestId } from '#utils/test-id/addTestId.utils.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getCreateCrudCreateFormTemplate(entityName: string) {
  const entityCasing = allCases(entityName)
  const createFormModelFile = getCreateCrudCreateFormModelFile(entityName)
  const uuidFile = getCreateCrudUuidModelFile(entityName)
  const mutationFile = getCreateCrudCreateApiMutationFile(entityName)

  const createFormSchemaImport = toTsImport({
    ...createFormModelFile,
    methodNames: [
      `${entityCasing.camelCase}CreateFormSchema`,
    ],
  })

  const mutationImport = toTsImport({
    ...mutationFile,
    methodNames: [
      `use${entityCasing.pascalCase}CreateMutation`,
    ],
  })

  const uuidImport = toTsImport({
    ...uuidFile,
    isType: true,
    methodNames: [
      `${entityCasing.pascalCase}Uuid`,
    ],
  })

  const createFormImport = toTsImport({
    ...createFormModelFile,
    isType: true,
    methodNames: [
      `${entityCasing.pascalCase}CreateForm`,
    ],
  })

  await addTranslation({
    key: `module.${entityCasing.snakeCase}.create.title`,
    value: `Create ${entityCasing.humanReadable}`,
  })

  await addTranslation({
    key: `module.${entityCasing.snakeCase}.info`,
    value: `${entityCasing.humanReadable} Info`,
  })

  addTestId({
    key: `${toPlural(entityCasing.upperCase)}.FORM.SUBMIT_BUTTON`,
    value: `${entityCasing.kebabCase}-create-form-submit-button`,
  })

  return `<script setup lang="ts">
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
${createFormSchemaImport}
${mutationImport}
${uuidImport}
${createFormImport}
import { toFormField } from '@/utils/formango.util'

const i18n = useI18n()
const router = useRouter()
const toast = useVcToast()
const errorToast = useApiErrorToast()
const ${entityCasing.camelCase}CreateMutation = use${entityCasing.pascalCase}CreateMutation()

const form = useForm({
  initialState: (): ${entityCasing.pascalCase}CreateForm => ({
    uuid: '' as ${entityCasing.pascalCase}Uuid,
  }),
  schema: ${entityCasing.camelCase}CreateFormSchema,
  onSubmit: async (values) => {
    try {
      const ${entityCasing.camelCase}Uuid = await ${entityCasing.camelCase}CreateMutation.execute({
        body: values,
      })

      await router.push({
        name: '${entityCasing.kebabCase}-detail',
        params: {
          ${entityCasing.camelCase}Uuid,
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
    <template #default="{ formId }">
      <AppTeleport to="headerActions">
        <FormSubmitButton
          :form="form"
          :form-id="formId"
          :data-test-id="TEST_ID.${toPlural(entityCasing.upperCase)}.FORM.SUBMIT_BUTTON"
          :label="i18n.t('shared.save')"
        />
      </AppTeleport>

      <FormLayout>
        <FormFieldset :title="i18n.t('module.${entityCasing.snakeCase}.info')">
          <VcTextField
            v-bind="toFormField(uuid)"
            :label="i18n.t('module.${entityCasing.snakeCase}.uuid')"
          />
        </FormFieldset>
      </FormLayout>
    </template>
  </FormRoot>
</template>

`
}
