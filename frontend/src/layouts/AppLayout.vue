<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { usePreferenceStore } from '@/stores/preferences'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import DarkModeToggle from '@/components/user/DarkModeToggle.vue'

const userStore = useUserStore()
const preferenceStore = usePreferenceStore()
const currentTime = ref('')
const route = useRoute()

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  updateTime()
  setInterval(updateTime, 60000)

  await preferenceStore.fetchPreference()

  // Appliquer la classe dark si besoin
  document.documentElement.classList.toggle('dark', preferenceStore.darkMode)
})

// Réagir aux changements dynamiques
watch(() => preferenceStore.darkMode, (isDark) => {
  document.documentElement.classList.toggle('dark', isDark)
})
</script>

<template>
  <div class="min-h-screen font-sans bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
   <header
  class="bg-white dark:bg-gray-800 shadow px-2 py-2 flex justify-between items-center"
>
  <div>
    Bonjour <strong>{{ userStore.user?.name }}</strong>
  </div>
  <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
    {{ currentTime }}
    <DarkModeToggle />
  </div>
</header>

    <main class="flex justify-center px-2 py-2">
      <div class="w-full max-w-2xl">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* rien de spécial ici pour l’instant */
</style>