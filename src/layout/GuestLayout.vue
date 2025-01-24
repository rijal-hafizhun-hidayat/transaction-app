<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()
</script>
<template>
  <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
    <div>
      <p class="text-3xl font-semibold text-center text-black">
        {{ props.title ?? 'TRANSACTION-APP' }}
      </p>
    </div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white mt-10 px-4 py-6 rounded shadow-md overflow-x-auto">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
