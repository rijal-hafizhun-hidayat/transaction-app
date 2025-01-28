<script setup lang="ts">
import DashboardLayout from '@/layout/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>
<template>
  <DashboardLayout>
    <template #header>
      <div class="flex justify-between">
        <div>
          <h2 class="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>
        </div>
      </div>
    </template>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <p>selamat datang {{ authStore.auth?.name }}</p>
      </div>
    </div>
  </DashboardLayout>
</template>
