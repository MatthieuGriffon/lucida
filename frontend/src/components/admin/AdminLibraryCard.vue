<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToLibrary() {
  router.push({ name: 'admin-books' })
}
</script>

<template>
  <div class="bg-gray-900 text-white rounded-xl p-6 shadow-md space-y-4">
    <h2 class="text-xl font-bold">Bibliothèque</h2>
    <p class="text-sm text-gray-300">
      Gère les livres disponibles dans Lucida : ajout, modification, suppression.
    </p>
    <button
      class="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
      @click="goToLibrary"
    >
      Accéder à la bibliothèque
    </button>
  </div>
</template>
