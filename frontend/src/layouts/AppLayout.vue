<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref, onMounted } from 'vue'


const userStore = useUserStore()
const currentTime = ref('')

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 60000) // maj chaque minute
})
</script>

<template>
  <div class="min-h-screen font-sans bg-gray-100 text-gray-900">
    <!-- Barre supérieure -->
    <header class="bg-white shadow px-6 py-4 flex justify-between items-center">
      <div>
        Bonjour <strong>{{ userStore.user?.name }}</strong>
      </div>
      <div class="text-sm text-gray-500">
        {{ currentTime }}
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="flex justify-center px-6 py-12">
      <div class="w-full max-w-2xl">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* rien de spécial ici pour l’instant */
</style>