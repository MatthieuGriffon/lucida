<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getUserBooks } from '@/api/books'

type Book = {
  id: string
  title: string
  author?: string
  epubPath: string
  createdAt: string
}

const books = ref<Book[]>([])
const loading = ref(true)
const error = ref('')

async function fetchBooks() {
  loading.value = true
  error.value = ''

  try {
    books.value = await getUserBooks()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur inconnue'
  } finally {
    loading.value = false
  }
}

onMounted(fetchBooks)
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <div>
  <RouterLink
    to="/dashboard"
    class="inline-block mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
  >
    ← Retour
  </RouterLink>
</div>
    <h1 class="text-3xl font-bold text-gray-900">Bibliothèque</h1>

    <div v-if="loading" class="text-gray-400">Chargement…</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="books.length === 0" class="text-gray-500">Aucun livre disponible pour le moment.</div>

    <ul v-else class="space-y-3">
      <li
        v-for="book in books"
        :key="book.id"
        class="bg-white border border-gray-300 rounded-xl p-4 flex justify-between items-center"
      >
        <div>
          <div class="text-lg font-semibold text-gray-900">{{ book.title }}</div>
          <div class="text-sm text-gray-500">{{ book.author || 'inconnu' }}</div>
        </div>
       <RouterLink
  :to="`/user/read/${book.id}`"
  class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded font-medium"
>
  Lire
</RouterLink>
      </li>
    </ul>
  </div>
</template>
