<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
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
const searchTerm = ref('')
const selectedSort = ref<'title_asc' | 'title_desc' | 'date_newest' | 'date_oldest'>('title_asc')

// 🧠 Chargement réel des livres
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

// 🧠 Tri réactif
const filteredBooks = computed(() => {
  const filtered = books.value.filter((book) => {
    const target = `${book.title} ${book.author ?? ''}`.toLowerCase()
    return target.includes(searchTerm.value.toLowerCase())
  })

  return filtered.sort((a, b) => {
    switch (selectedSort.value) {
      case 'title_asc':
        return a.title.localeCompare(b.title)
      case 'title_desc':
        return b.title.localeCompare(a.title)
      case 'date_newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'date_oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      default:
        return 0
    }
  })
})
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto space-y-6">
    <div>
  <RouterLink
  to="/dashboard"
  class="inline-block mb-4 
         bg-gray-200 hover:bg-gray-300 text-gray-800 
         dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white 
         px-4 py-2 rounded-lg font-medium"
>
  ← Retour
</RouterLink>
</div>
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Bibliothèque</h1>
      <div class="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
  <div>
    <label for="sort" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
      Trier par :
    </label>
    <select
      id="sort"
      v-model="selectedSort"
      class="w-full sm:w-auto px-3 py-2 text-sm rounded-md border border-gray-300
             bg-white dark:bg-gray-800 text-gray-900 dark:text-white
             focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="title_asc">Titre A → Z</option>
      <option value="title_desc">Titre Z → A</option>
      <option value="date_newest">Ajouté récemment</option>
      <option value="date_oldest">Ajouté en premier</option>
    </select>
  </div>

  <input
  v-model="searchTerm"
  type="text"
  placeholder="Rechercher un titre ou un auteur"
  class="w-full mt-5 sm:w-80 px-3 py-2 text-sm rounded-md border border-gray-300
         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
         focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</div>
    <div v-if="loading" class="text-gray-400">Chargement…</div>
    <div v-else-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="filteredBooks.length === 0" class="text-gray-500">Aucun livre disponible pour le moment.</div>



    <div v-else class="max-h-[60vh] overflow-y-auto pr-1">
  <ul class="space-y-3">
      <li
  v-for="book in filteredBooks"
  :key="book.id"
      class="bg-white border border-gray-300 rounded-xl p-4 flex justify-between items-center"
    >
      <div>
        <div class="text-lg font-semibold text-gray-900">{{ book.title }}</div>
        <div class="text-sm text-gray-500">{{ book.author || 'inconnu' }}</div>
      </div>
      <RouterLink
        :to="`/user/read/${book.id}`"
        class="px-4 py-2 rounded-lg font-semibold text-sm
               bg-blue-600 text-white hover:bg-blue-700
               dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        aria-label="Lire le livre"
      >
        <span aria-hidden="true" class="mr-1">📖</span> Lire
      </RouterLink>
    </li>
  </ul>
</div>
  </div>
</template>
