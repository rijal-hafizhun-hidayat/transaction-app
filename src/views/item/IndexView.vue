<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import DangerButton from '@/components/base/DangerButton.vue'
import { onMounted, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugin/api'
import { Timestamp } from '@/utils/Timestamp'
import { useRouter } from 'vue-router'
import type { Validation } from '@/interface/GlobalInterface'
import type { Item, ItemFetch } from '@/interface/ItemInterface'
import { ErrorUtil } from '@/utils/ErrorUtil'
import { SweetAlertUtil } from '@/utils/SweetAlertUtil'
import { NumberUtil } from '@/utils/NumberUtil'

const router = useRouter()
const validation: Ref<Validation | null> = ref(null)
const isLoadingButton: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(false)
const items: Ref<Item[]> = ref([])

onMounted(async (): Promise<void> => {
  try {
    isLoading.value = true
    const result: AxiosResponse<ItemFetch> = await api.get('item')
    items.value = result.data.data as Item[]
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

const destroyItemByItemId = async (itemId: number) => {
  try {
    isLoadingButton.value = true
    const result: AxiosResponse<ItemFetch> = await api.delete(`item/${itemId}`)
    SweetAlertUtil.successAlert(result.data.message)
    items.value = items.value.filter((item) => item.id !== itemId)
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
    isLoadingButton.value = false
  }
}

const toItemShowView = (itemId: number): void => {
  router.push({
    name: 'item.show',
    params: {
      itemId: itemId,
    },
  })
}

const toItemCreateView = (): void => {
  router.push({
    name: 'item.create',
  })
}
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Barang</h2>
        </div>
        <div>
          <PrimaryButton @click="toItemCreateView" type="button">Tambah Barang</PrimaryButton>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <table class="w-full whitespace-nowrap">
          <thead>
            <tr class="text-left font-bold">
              <th class="pb-4 pt-6 px-6">#</th>
              <th class="pb-4 pt-6 px-6">Kode</th>
              <th class="pb-4 pt-6 px-6">Nama</th>
              <th class="pb-4 pt-6 px-6">Harga</th>
              <th class="pb-4 pt-6 px-6">Dibuat Tanggal</th>
              <th class="pb-4 pt-6 px-6">Aksi</th>
            </tr>
          </thead>
          <tbody v-if="items.length > 0">
            <tr v-for="(item, index) in items" :key="item.id" class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4">
                {{ index + 1 }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ item.kode }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ item.nama }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ NumberUtil.formatRupiah(item.harga) }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(item.created_at) }}
              </td>
              <td class="border-t items-center px-6 py-4 flex justify-start space-x-4">
                <div>
                  <PrimaryButton
                    @click="toItemShowView(item.id)"
                    :disabled="isLoadingButton"
                    type="button"
                    >Ubah</PrimaryButton
                  >
                </div>
                <div>
                  <DangerButton
                    @click="destroyItemByItemId(item.id)"
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
              <td class="border-t items-center px-6 py-4 text-center" colspan="4">
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
