<script setup lang="ts">
import { usePreferenceStore } from '@/stores/preferences'

const store = usePreferenceStore()

const sizeSteps = ['100%', '125%', '150%', '175%', '200%', '225%', '250%', '300%']

function increaseFont() {
  const idx = sizeSteps.indexOf(store.fontSize)
  if (idx < sizeSteps.length - 1) {
    store.updateFontSize(sizeSteps[idx + 1])
  }
}

function decreaseFont() {
  const idx = sizeSteps.indexOf(store.fontSize)
  if (idx > 0) {
    store.updateFontSize(sizeSteps[idx - 1])
  }
}

function resetFont() {
  store.updateFontSize('125%')
}
</script>

<template>
  <div class="flex items-center space-x-2 bg-gray-800 text-white p-2 rounded-lg shadow-lg">
    <button @click="decreaseFont" class="text-xl px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">A–</button>
    <span class="text-sm">{{ store.fontSize }}</span>
    <button @click="increaseFont" class="text-xl px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">A+</button>
    <button @click="resetFont" class="text-sm px-2 py-1 ml-2 bg-gray-600 rounded hover:bg-gray-500">Réinit.</button>
  </div>
</template>