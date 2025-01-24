<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

defineProps({
  modelValue: {
    type: Object as () => Date | null, // Allow Date or null
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const input: Ref<HTMLInputElement | null> = ref(null)

onMounted(() => {
  if (input.value?.hasAttribute('autofocus')) {
    input.value.focus()
  }
})

defineExpose({ focus: () => input.value?.focus() })

// Format a Date object as YYYY-MM-DD or return an empty string if null
const formatDate = (date: Date | null): string => {
  if (!date) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Parse a YYYY-MM-DD string into a Date object or return null if invalid
const parseDate = (dateString: string): Date | null => {
  const [year, month, day] = dateString.split('-').map(Number)
  return year && month && day ? new Date(year, month - 1, day) : null
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const parsedDate = parseDate(target.value)
  emit('update:modelValue', parsedDate) // Emit null if parsing fails
}
</script>

<template>
  <input
    type="date"
    class="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
    :value="formatDate(modelValue)"
    @input="handleInput"
    ref="input"
  />
</template>
