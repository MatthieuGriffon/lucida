<script setup lang="ts">
import { toasts } from '@/composables/useToast'
</script>

<template>
  <div class="fixed top-6 left-1/2 transform -translate-x-1/2 space-y-2 z-50">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="px-4 py-2 rounded shadow-lg text-white text-sm transition"
      :class="{
        'bg-green-600': toast.type === 'success',
        'bg-red-600': toast.type === 'error',
        'bg-blue-600': toast.type === 'info',
      }"
    >
      {{ toast.message }}
    </div>
  </div>
</template>