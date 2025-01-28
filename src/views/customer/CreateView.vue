<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import InputError from '@/components/base/InputError.vue'
import TextInput from '@/components/base/TextInput.vue'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { CustomerForm, FetchCustomer, FetchCustomerCode } from '@/interface/CustomerInterface'
import type { Validation } from '@/interface/GlobalInterface'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugin/api'
import { SweetAlertUtil } from '@/utils/SweetAlertUtil'
import { useRouter } from 'vue-router'
import { ErrorUtil } from '@/utils/ErrorUtil'

const router = useRouter()
const isLoading: Ref<boolean> = ref(false)
const validation: Ref<Validation | null> = ref(null)
const form: CustomerForm = reactive({
  code: '',
  name: '',
  phone_number: '',
})

onMounted(async () => {
  try {
    const result: AxiosResponse<FetchCustomerCode> = await api.get('customer/code')
    form.code = result.data.data as string
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  }
})

const send = async (): Promise<void> => {
  try {
    isLoading.value = true
    const result: AxiosResponse<FetchCustomer> = await api.post('customer', {
      name: form.name,
      kode: form.code,
      phone_number: form.phone_number,
    })

    SweetAlertUtil.successAlert(result.data.message)
    router.push({
      name: 'customer.index',
    })
  } catch (error) {
    const err = error as AxiosError
    if (err.response?.status === 400) {
      validation.value = err.response as Validation
    } else if (err.response?.status === 404) {
      validation.value = err.response as Validation
      const errors = ErrorUtil.formatErrorMessage(validation.value.data.errors)
      SweetAlertUtil.errorAlert(errors)
    }
  } finally {
    isLoading.value = false
  }
}

const formatPhoneNumber = (event: Event): void => {
  const target = event.target as HTMLInputElement
  let rawValue = target.value.replace(/\D/g, '')

  if (!rawValue.startsWith('08')) {
    rawValue = '08' + rawValue.replace(/^0+/, '')
  }

  rawValue = rawValue.slice(0, 13)
  form.phone_number = rawValue
}
</script>
<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="send" class="space-y-4">
          <div>
            <InputLabel>kode</InputLabel>
            <TextInput :disabled="true" type="text" class="block mt-1 w-full" v-model="form.code" />
            <InputError
              v-if="validation && validation.status === 400 && validation.data.errors.code"
              :message="validation.data.errors.code[0]"
            />
          </div>
          <div>
            <InputLabel>nama</InputLabel>
            <TextInput type="text" class="block mt-1 w-full" v-model="form.name" />
            <InputError
              v-if="validation && validation.status === 400 && validation.data.errors.name"
              :message="validation.data.errors.name[0]"
            />
          </div>
          <div>
            <InputLabel>nomor telpon</InputLabel>
            <TextInput
              type="text"
              maxlength="14"
              @input="formatPhoneNumber"
              class="block mt-1 w-full"
              v-model="form.phone_number"
            />
            <InputError
              v-if="validation && validation.status === 400 && validation.data.errors.phone_number"
              :message="validation.data.errors.phone_number[0]"
            />
          </div>
          <div class="flex justify-end">
            <PrimaryButton :disabled="isLoading" type="submit">simpan</PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>
