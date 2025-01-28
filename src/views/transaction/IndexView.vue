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
import { NumberUtil } from '@/utils/NumberUtil'
import { SweetAlertUtil } from '@/utils/SweetAlertUtil'
import type { SearchForm, Transaction, TransactionFetch } from '@/interface/TransactionInterface'
import type { Validation } from '@/interface/GlobalInterface'
import { ErrorUtil } from '@/utils/ErrorUtil'

const router = useRouter()
const isLoadingButton: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(false)
const validation: Ref<Validation | null> = ref(null)
const transactions: Ref<Transaction[]> = ref([])
const sumTotal: Ref<number> = ref(0)
const form: SearchForm = reactive({
  search: '',
})

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<TransactionFetch> = await api.get('transaction')
    transactions.value = result.data.data as Transaction[]
    sumTotal.value = result.data.sum_total
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

const search = async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<TransactionFetch> = await api.get('transaction', {
      params: {
        search: form.search,
      },
    })
    transactions.value = result.data.data as Transaction[]
    sumTotal.value = result.data.sum_total
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

const destroyTransactionByTransactionId = async (transactionId: number) => {
  try {
    isLoadingButton.value = true
    const result: AxiosResponse<TransactionFetch> = await api.delete(`transaction/${transactionId}`)
    transactions.value = transactions.value.filter(
      (transaction) => transaction.id !== transactionId,
    )
    SweetAlertUtil.successAlert(result.data.message)
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

const toTransactionCreateView = () => {
  router.push({
    name: 'transaction.create',
  })
}

const toTransactionShowView = (transactionId: number) => {
  router.push({
    name: 'transaction.show',
    params: {
      transactionId: transactionId,
    },
  })
}
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Transaksi</h2>
        </div>
        <div>
          <PrimaryButton type="button" @click="toTransactionCreateView"
            >Tambah Transaksi</PrimaryButton
          >
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
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md">
        <div class="overflow-x-auto">
          <table class="w-full whitespace-nowrap">
            <thead>
              <tr class="text-left font-bold">
                <th class="pb-4 pt-6 px-6">#</th>
                <th class="pb-4 pt-6 px-6">No Transaksi</th>
                <th class="pb-4 pt-6 px-6">Tanggal</th>
                <th class="pb-4 pt-6 px-6">Nama Costumer</th>
                <th class="pb-4 pt-6 px-6">Jumlah Barang</th>
                <th class="pb-4 pt-6 px-6">Sub total</th>
                <th class="pb-4 pt-6 px-6">Diskon</th>
                <th class="pb-4 pt-6 px-6">Ongkir</th>
                <th class="pb-4 pt-6 px-6">Total</th>
                <th class="pb-4 pt-6 px-6">Aksi</th>
              </tr>
            </thead>
            <tbody v-if="transactions.length > 0">
              <tr
                v-for="(transaction, index) in transactions"
                :key="transaction.id"
                class="hover:bg-gray-100"
              >
                <td class="border-t items-center px-6 py-4">
                  {{ index + 1 }}
                </td>
                <td class="border-t items-center px-6 py-4">
                  {{ transaction.kode }}
                </td>
                <td class="border-t items-center px-6 py-4">
                  {{ Timestamp.formatTimestamp(transaction.tgl) }}
                </td>
                <td class="border-t items-center px-6 py-4">
                  {{ transaction.customer.name }}
                </td>
                <td class="border-t items-center px-6 py-4">
                  {{ transaction.total_qty }}
                </td>
                <td class="border-t items-center px-6 py-4">
                  {{ NumberUtil.formatRupiah(transaction.subtotal) }}
                </td>
                <td class="border-t items-center px-6 py-4">
                  {{ transaction.diskon }}
                </td>
                <td class="border-t items-center px-6 py-4">
                  {{ NumberUtil.formatRupiah(transaction.ongkir) }}
                </td>
                <td class="border-t items-center px-6 py-4">
                  {{ NumberUtil.formatRupiah(transaction.total_bayar) }}
                </td>
                <td class="border-t items-center px-6 py-4 flex justify-start space-x-4">
                  <div>
                    <PrimaryButton
                      @click="toTransactionShowView(transaction.id)"
                      :disabled="isLoadingButton"
                      type="button"
                      >Ubah</PrimaryButton
                    >
                  </div>
                  <div>
                    <DangerButton
                      @click="destroyTransactionByTransactionId(transaction.id)"
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
                <td class="border-t items-center px-6 py-4 text-center" colspan="10">
                  <span v-if="isLoading === true">loading ...</span>
                  <span v-else>data not found</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end">
          <h1 class="font-semibold">Grand Total: {{ NumberUtil.formatRupiah(sumTotal) }}</h1>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>
