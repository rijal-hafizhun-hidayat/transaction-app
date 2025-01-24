<script setup lang="ts">
import GuestLayout from '@/layout/GuestLayout.vue'
import PrimaryButton from '@/components/base/PrimaryButton.vue'
</script>
<template>
  <GuestLayout>
    <div class="space-y-5">
      <div class="flex justify-end">
        <PrimaryButton type="button">Tambah Transaksi</PrimaryButton>
      </div>
      <div>
        <table class="w-full whitespace-nowrap">
          <thead>
            <tr class="text-left font-bold">
              <th class="pb-4 pt-6 px-6">#</th>
              <th class="pb-4 pt-6 px-6">No Transaksi</th>
              <th class="pb-4 pt-6 px-6">Tanggal</th>
              <th class="pb-4 pt-6 px-6">Nama Costumer</th>
              <th class="pb-4 pt-6 px-6">Jumlah Barang</th>
              <th class="pb-4 pt-6 px-6">Sub Total</th>
              <th class="pb-4 pt-6 px-6">Diskon</th>
              <th class="pb-4 pt-6 px-6">Ongkir</th>
              <th class="pb-4 pt-6 px-6">Total</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  </GuestLayout>
</template>
