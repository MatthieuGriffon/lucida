<script setup lang="ts">
const props = defineProps<{
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
    <div class="bg-white text-gray-900 p-6 rounded-xl w-full max-w-md shadow-xl space-y-4">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <p class="text-sm text-gray-700">{{ message }}</p>

      <div class="flex justify-end gap-3 pt-4">
        <button
          class="px-4 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300"
          @click="$emit('cancel')"
        >
          {{ cancelLabel || 'Annuler' }}
        </button>
        <button
          class="px-4 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
          @click="$emit('confirm')"
        >
          {{ confirmLabel || 'Confirmer' }}
        </button>
      </div>
    </div>
  </div>
</template>