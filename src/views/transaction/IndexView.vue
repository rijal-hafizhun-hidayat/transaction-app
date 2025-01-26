<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import { useRouter } from 'vue-router'
import { onMounted, ref, type Ref } from 'vue'
import type { AxiosError, AxiosResponse } from 'axios'
import api from '@/plugin/api'
import { Timestamp } from '@/utils/Timestamp'
import { NumberUtil } from '@/utils/NumberUtil'

interface Fetch {
  message: string
  data: Transaction[]
}
interface Transaction {
  id: number
  kode: string
  tgl: Date
  subtotal: number
  diskon: number
  ongkir: number
  total_bayar: number
  total_qty: number
  created_at: Date
  updated_at: Date
  customer: {
    kode: string
    name: string
    telp: string
    created_at: Date
    updated_at: Date
  }
}

const router = useRouter()
const isLoading: Ref<boolean> = ref(false)
const transactions: Ref<Transaction[]> = ref([])

onMounted(async () => {
  try {
    isLoading.value = true
    const result: AxiosResponse<Fetch> = await api.get('transaction')
    transactions.value = result.data.data as Transaction[]
  } catch (error) {
    const err = error as AxiosError
    console.log(err)
  } finally {
    isLoading.value = false
  }
})
const toTransactionCreateView = () => {
  router.push({
    name: 'transaction.create',
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
            </tr>
          </tbody>
          <tbody v-else>
            <tr class="hover:bg-gray-100">
              <td class="border-t items-center px-6 py-4 text-center" colspan="8">
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
