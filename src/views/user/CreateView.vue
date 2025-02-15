<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import InputLabel from '@/components/base/InputLabel.vue'
import TextInput from '@/components/base/TextInput.vue'
import InputError from '@/components/base/InputError.vue'
import AlertForm from '@/components/base/AlertForm.vue'
import PointerRequired from '@/components/base/PointerRequired.vue'
import Multiselect from 'vue-multiselect'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugin/api'
import { useRouter } from 'vue-router'
import { SweetAlertUtil } from '@/utils/SweetAlertUtil'
import { ErrorUtil } from '@/utils/ErrorUtil'
import type { Validation } from '@/interface/GlobalInterface'
import type { UserFetch, UserForm } from '@/interface/UserInterface'
import type { FetchRole, Role } from '@/interface/RoleInterface'

const router = useRouter()
const validation: Ref<Validation | null> = ref(null)
const isLoadingRoles: Ref<boolean> = ref(false)
const roles: Ref<Role[]> = ref([])
const isLoading: Ref<boolean> = ref(false)
const form: UserForm = reactive({
  name: '',
  email: '',
  password: '',
  role: null,
})

onMounted(async () => {
  try {
    isLoadingRoles.value = true
    const result: AxiosResponse<FetchRole> = await api.get('role')
    roles.value = result.data.data as Role[]
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoadingRoles.value = false
  }
})

const send = async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<UserFetch> = await api.post('user', {
      name: form.name,
      email: form.email,
      password: form.password,
      role: form.role,
    })
    SweetAlertUtil.successAlert(result.data.message)
    router.push({
      name: 'user.index',
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
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Tambah Pengguna</h2>
        </div>
      </div>
    </template>

    <AlertForm />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="send" class="space-y-4">
          <div>
            <InputLabel>nama <PointerRequired /></InputLabel>
            <TextInput type="text" class="block mt-1 w-full" v-model="form.name" />
            <InputError
              v-if="validation && validation.status === 400 && validation.data.errors.name"
              :message="validation.data.errors.name[0]"
            />
          </div>
          <div>
            <InputLabel>email <PointerRequired /></InputLabel>
            <TextInput type="email" class="block mt-1 w-full" v-model="form.email" />
            <InputError
              v-if="validation && validation.status === 400 && validation.data.errors.email"
              :message="validation.data.errors.email[0]"
            />
          </div>
          <div>
            <InputLabel>role <PointerRequired /></InputLabel>
            <Multiselect
              :close-on-select="true"
              :clear-on-select="true"
              :disabled="isLoadingRoles"
              class="block mt-1 w-full"
              v-model="form.role"
              tag-placeholder="Add this as new tag"
              placeholder="Search or add a tag"
              track-by="id"
              label="name"
              :options="roles"
              :multiple="false"
              :taggable="false"
            ></Multiselect>
            <InputError
              v-if="validation && validation.status === 400 && validation.data.errors.role"
              :message="validation.data.errors.role[0]"
            />
          </div>
          <div>
            <InputLabel>password <PointerRequired /></InputLabel>
            <TextInput type="password" class="block mt-1 w-full" v-model="form.password" />
            <InputError
              v-if="validation && validation.status === 400 && validation.data.errors.password"
              :message="validation.data.errors.password[0]"
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
