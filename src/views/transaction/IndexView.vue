<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

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
              <th class="pb-4 pt-6 px-6">Judul</th>
              <th class="pb-4 pt-6 px-6">Deskripsi</th>
              <th class="pb-4 pt-6 px-6">Dimulai</th>
              <th class="pb-4 pt-6 px-6">Selesai</th>
              <th class="pb-4 pt-6 px-6">Status</th>
              <th class="pb-4 pt-6 px-6">Dibuat Tanggal</th>
              <th class="pb-4 pt-6 px-6">Aksi</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  </DashboardLayout>
</template>
