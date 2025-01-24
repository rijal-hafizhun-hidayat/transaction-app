<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

defineProps({
  modelValue: {
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const input: Ref<HTMLInputElement | null> = ref(null)

onMounted(() => {
  if (input.value?.hasAttribute('autofocus')) {
    input.value?.focus()
  }
})

defineExpose({ focus: () => input.value?.focus() })

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  if (target) {
    // Emit the updated value safely
    emit('update:modelValue', target.value)
  }
}
</script>

<template>
  <input
    class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
    :value="modelValue"
    @input="handleInput"
    ref="input"
  />
</template>
