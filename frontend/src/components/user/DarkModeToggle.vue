<!-- src/components/user/DarkModeToggle.vue -->
<script setup lang="ts">
import { usePreferenceStore } from '@/stores/preferences'

const preferenceStore = usePreferenceStore()

function toggleDarkMode() {
  preferenceStore.darkMode = !preferenceStore.darkMode
  preferenceStore.savePreferences()
}
</script>

<template>
  <button
    @click="toggleDarkMode"
    :aria-pressed="preferenceStore.darkMode"
    class="rounded-2xl px-6 py-3 text-lg font-medium 
           bg-gray-200 dark:bg-gray-700 
           text-gray-800 dark:text-white 
           hover:bg-gray-300 dark:hover:bg-gray-600 
           focus:outline-none focus:ring-2 focus:ring-blue-500 
           transition"
  >
    {{ preferenceStore.darkMode ? '☀️ Mode clair' : '🌙 Mode sombre' }}
  </button>
</template>