import {
  getCreateCrudCreateApiMutationFile,
  getCreateCrudCreateFormModelFile,
} from '#commands/create-crud/create/createCrudCreate.files.ts'
import { getCreateCrudUuidModelFile } from '#commands/create-crud/uuid/createCrudUuid.files.ts'
import type { EntityCasing } from '#utils/casing/caseTransformer.utils.ts'
import { toTsImport } from '#utils/files/toTsImport.ts'
import { toPlural } from '#utils/pluralize/pluralize.utils.ts'
import { addTestId } from '#utils/test-id/addTestId.utils.ts'
import { addTranslation } from '#utils/translation/addTranslation.utils.ts'

export async function getCreateCrudCreateFormTemplate(entityName: EntityCasing) {
  const createFormModelFile = getCreateCrudCreateFormModelFile(entityName)
  const uuidFile = getCreateCrudUuidModelFile(entityName)
  const mutationFile = getCreateCrudCreateApiMutationFile(entityName)

  const createFormSchemaImport = toTsImport({
    ...createFormModelFile,
    methodNames: [
      `${entityName.camelCase}CreateFormSchema`,
    ],
  })

  const mutationImport = toTsImport({
    ...mutationFile,
    methodNames: [
      `use${entityName.pascalCase}CreateMutation`,
    ],
  })

  const uuidImport = toTsImport({
    ...uuidFile,
    isType: true,
    methodNames: [
      `${entityName.pascalCase}Uuid`,
    ],
  })

  const createFormImport = toTsImport({
    ...createFormModelFile,
    isType: true,
    methodNames: [
      `${entityName.pascalCase}CreateForm`,
    ],
  })

  await addTranslation({
    key: `module.${entityName.snakeCase}.create.title`,
    value: `Create ${entityName.humanReadable}`,
  })

  await addTranslation({
    key: `module.${entityName.snakeCase}.info`,
    value: `${entityName.humanReadable} Info`,
  })

  addTestId({
    key: `${toPlural(entityName.upperCase)}.FORM.SUBMIT_BUTTON`,
    value: `${entityName.kebabCase}-create-form-submit-button`,
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
const ${entityName.camelCase}CreateMutation = use${entityName.pascalCase}CreateMutation()

const form = useForm({
  initialState: (): ${entityName.pascalCase}CreateForm => ({
    uuid: '' as ${entityName.pascalCase}Uuid,
  }),
  schema: ${entityName.camelCase}CreateFormSchema,
  onSubmit: async (values) => {
    try {
      const ${entityName.camelCase}Uuid = await ${entityName.camelCase}CreateMutation.execute({
        body: values,
      })

      await router.push({
        name: '${entityName.kebabCase}-detail',
        params: {
          ${entityName.camelCase}Uuid,
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
          :data-test-id="TEST_ID.${toPlural(entityName.upperCase)}.FORM.SUBMIT_BUTTON"
          :label="i18n.t('shared.save')"
        />
      </AppTeleport>

      <FormLayout>
        <FormFieldset :title="i18n.t('module.${entityName.snakeCase}.info')">
          <VcTextField
            v-bind="toFormField(uuid)"
            :label="i18n.t('module.${entityName.snakeCase}.uuid')"
          />
        </FormFieldset>
      </FormLayout>
    </template>
  </FormRoot>
</template>

`
}
