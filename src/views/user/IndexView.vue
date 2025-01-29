<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import DangerButton from '@/components/base/DangerButton.vue'
import TextInput from '@/components/base/TextInput.vue'
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugin/api'
import { Timestamp } from '@/utils/Timestamp'
import { SweetAlertUtil } from '@/utils/SweetAlertUtil'
import type { SearchUserForm, UserFetch, UserWithRole } from '@/interface/UserInterface'
import type { Validation } from '@/interface/GlobalInterface'
import { ErrorUtil } from '@/utils/ErrorUtil'

const router = useRouter()
const validation: Ref<Validation | null> = ref(null)
const isLoading: Ref<boolean> = ref(false)
const isLoadingButton: Ref<boolean> = ref(false)
const users: Ref<UserWithRole[]> = ref([])

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<UserFetch> = await api.get('user')
    users.value = result.data.data as UserWithRole[]
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
})

const form: SearchUserForm = reactive({
  search: '',
})

const search = async (): Promise<void> => {
  try {
    isLoading.value = true
    const result: AxiosResponse<UserFetch> = await api.get('user', {
      params: {
        search: form.search,
      },
    })
    users.value = result.data.data as UserWithRole[]
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

const destroyUserByUserId = async (userId: number) => {
  try {
    isLoadingButton.value = true
    const result: AxiosResponse<UserFetch> = await api.delete(`user/${userId}`)
    SweetAlertUtil.successAlert(result.data.message)
    users.value = users.value.filter((user) => user.id !== userId)
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoadingButton.value = false
  }
}

const toUserShowView = (userId: number) => {
  router.push({
    name: 'user.show',
    params: {
      userId: userId,
    },
  })
}

const toUserCreateView = () => {
  router.push({
    name: 'user.create',
  })
}
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Pengguna</h2>
        </div>
        <div>
          <PrimaryButton @click="toUserCreateView" type="button">Tambah Pengguna</PrimaryButton>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <form @submit.prevent="search" class="grid grid-cols-2 gap-2">
          <div>
            <TextInput placeholder="cari keyword" v-model="form.search" class="w-full" />
          </div>
          <div>
            <PrimaryButton class="my-1" type="submit">search</PrimaryButton>
          </div>
        </form>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <table class="w-full whitespace-nowrap">
          <thead>
            <tr class="text-left font-bold">
              <th class="pb-4 pt-6 px-6">#</th>
              <th class="pb-4 pt-6 px-6">Name</th>
              <th class="pb-4 pt-6 px-6">Email</th>
              <th class="pb-4 pt-6 px-6">Sebagai</th>
              <th class="pb-4 pt-6 px-6">Dibuat Tanggal</th>
              <th class="pb-4 pt-6 px-6">Aksi</th>
            </tr>
          </thead>
          <tbody v-if="users.length > 0">
            <tr v-for="(user, index) in users" :key="user.id" class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4">
                {{ index + 1 }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ user.name }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ user.email }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ user.role?.name }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(user.created_at) }}
              </td>
              <td class="border-t items-center px-6 py-4 flex justify-start space-x-4">
                <div>
                  <PrimaryButton
                    @click="toUserShowView(user.id)"
                    :disabled="isLoadingButton"
                    type="button"
                    >Ubah</PrimaryButton
                  >
                </div>
                <div>
                  <DangerButton
                    @click="destroyUserByUserId(user.id)"
                    :disabled="isLoadingButton"
                    type="button"
                    >Hapus</DangerButton
                  >
                </div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4 text-center" colspan="6">
                <span v-if="isLoading === true">loading ...</span>
                <span v-else>data not found</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </DashboardLayout>
</template>
