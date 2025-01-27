<script setup lang="ts">
import GuestLayout from '@/layout/GuestLayout.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import TextInput from '@/components/base/TextInput.vue'
import InputError from '@/components/base/InputError.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import { reactive, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'
import { ErrorUtil } from '@/utils/ErrorUtil'
import { SweetAlertUtil } from '@/utils/SweetAlertUtil'
import { useAuthStore } from '@/stores/auth'

interface Form {
  email: string
  password: string
}
interface Validation {
  status: number
  data: {
    statusCode: number
    errors: Record<string, string[]>
  }
}

const authStore = useAuthStore()
const validation: Ref<Validation | null> = ref(null)
const router = useRouter()
const isLoading: Ref<boolean> = ref(false)
const form: Form = reactive({
  email: '',
  password: '',
})

const send = async () => {
  try {
    isLoading.value = true
    await authStore.login(form)
    router.push({
      name: 'dashboard.index',
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
  <GuestLayout>
    <form @submit.prevent="send()" class="space-y-4">
      <div>
        <InputLabel>email</InputLabel>
        <TextInput type="email" class="mt-1 block w-full" v-model="form.email" />
        <InputError
          v-if="validation && validation.status === 400 && validation.data.errors.email"
          :message="validation.data.errors.email[0]"
        />
      </div>
      <div>
        <InputLabel>password</InputLabel>
        <TextInput type="password" class="mt-1 block w-full" v-model="form.password" />
        <InputError
          v-if="validation && validation.status === 400 && validation.data.errors.password"
          :message="validation.data.errors.password[0]"
        />
      </div>
      <div class="flex justify-between">
        <div>
          <PrimaryButton :disabled="isLoading" type="submit">login</PrimaryButton>
        </div>
      </div>
    </form>
  </GuestLayout>
</template>
