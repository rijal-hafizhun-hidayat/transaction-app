<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import TextInput from '@/components/base/TextInput.vue'
import InputError from '@/components/base/InputError.vue'
import { reactive, ref, type Ref } from 'vue'
import type { FetchRole, RoleForm } from '@/interface/RoleInterface'
import type { Validation } from '@/interface/GlobalInterface'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugin/api'
import { SweetAlertUtil } from '@/utils/SweetAlertUtil'
import { useRouter } from 'vue-router'
import { ErrorUtil } from '@/utils/ErrorUtil'

const router = useRouter()
const validation: Ref<Validation | null> = ref(null)
const isLoading: Ref<boolean> = ref(false)
const form: RoleForm = reactive({
  name: '',
})

const send = async (): Promise<void> => {
  try {
    isLoading.value = true
    const result: AxiosResponse<FetchRole> = await api.post('role', {
      name: form.name,
    })
    SweetAlertUtil.successAlert(result.data.message)
    router.push({
      name: 'role.index',
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
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Tambah Role</h2>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="send" class="space-y-4">
          <div>
            <InputLabel>nama</InputLabel>
            <TextInput type="text" class="block mt-1 w-full" v-model="form.name" />
            <InputError
              v-if="validation && validation.status === 400 && validation.data.errors.name"
              :message="validation.data.errors.name[0]"
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
