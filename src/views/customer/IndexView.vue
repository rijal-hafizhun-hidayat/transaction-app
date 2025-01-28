<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import DangerButton from '@/components/base/DangerButton.vue'
import { useRouter } from 'vue-router'
import { onMounted, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugin/api'
import type { Customer, FetchCustomer } from '@/interface/CustomerInterface'
import { Timestamp } from '@/utils/Timestamp'
import { SweetAlertUtil } from '@/utils/SweetAlertUtil'

const isLoading: Ref<boolean> = ref(false)
const isLoadingButton: Ref<boolean> = ref(false)
const router = useRouter()
const customers: Ref<Customer[]> = ref([])

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<FetchCustomer> = await api.get('customer')
    customers.value = result.data.data as Customer[]
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoading.value = false
  }
})

const toCustomerShowView = (customerId: number) => {
  router.push({
    name: 'customer.show',
    params: {
      customerId: customerId,
    },
  })
}

const toCustomerCreateView = () => {
  router.push({
    name: 'customer.create',
  })
}

const destroyCustomerByCustomerId = async (customerId: number) => {
  try {
    isLoadingButton.value = true
    const result: AxiosResponse<FetchCustomer> = await api.delete(`customer/${customerId}`)
    SweetAlertUtil.successAlert(result.data.message)
    customers.value = customers.value.filter((customer) => customer.id !== customerId)
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoadingButton.value = false
  }
}
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Pelanggan</h2>
        </div>
        <div>
          <PrimaryButton @click="toCustomerCreateView" type="button"
            >Tambah Pelanggan</PrimaryButton
          >
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
              <th class="pb-4 pt-6 px-6">Nomor Telpon</th>
              <th class="pb-4 pt-6 px-6">Dibuat Tanggal</th>
              <th class="pb-4 pt-6 px-6">Aksi</th>
            </tr>
          </thead>
          <tbody v-if="customers.length > 0">
            <tr v-for="(customer, index) in customers" :key="customer.id" class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4">
                {{ index + 1 }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ customer.kode }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ customer.nama }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ customer.telp }}
              </td>
              <td class="border-t items-center px-6 py-4">
                {{ Timestamp.formatTimestamp(customer.created_at) }}
              </td>
              <td class="border-t items-center px-6 py-4 flex justify-start space-x-4">
                <div>
                  <PrimaryButton
                    @click="toCustomerShowView(customer.id)"
                    :disabled="isLoadingButton"
                    type="button"
                    >Ubah</PrimaryButton
                  >
                </div>
                <div>
                  <DangerButton
                    @click="destroyCustomerByCustomerId(customer.id)"
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
