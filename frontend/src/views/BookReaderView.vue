<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ePub from 'epubjs'

const route = useRoute()
const router = useRouter()

type Book = {
  id: string
  title: string
  author?: string
  epubPath: string
  createdAt: string
}

const book = ref<Book | null>(null)
const loading = ref(true)
const error = ref('')
const TEST_MODE = false // ← Passe à false pour revenir au mode normal

async function fetchBook(id: string) {
  loading.value = true
  error.value = ''

  try {
    const res = await fetch(`/api/books/${id}`, {
      credentials: 'include',
    })

    if (!res.ok) {
      throw new Error((await res.json()).message || 'Erreur serveur')
    }

    book.value = await res.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur inconnue'
  } finally {
    loading.value = false
  }
}

function initReader(epubPath: string) {
  console.log('📖 Initialisation du lecteur avec :', epubPath)

  const bookInstance = ePub(epubPath)
  console.log('📦 Instance ePub créée')

  // 👇 Vérifie si l'élément #reader est présent dans le DOM
  console.log('🔍 Élément #reader trouvé ?', document.getElementById('reader') !== null)

  const rendition = bookInstance.renderTo('reader', {
    width: '100%',
    height: '70vh',
    flow: 'paginated',
  })
  console.log('🖼️ Rendition configurée')

  rendition.display()
    .then(() => {
      console.log('✅ Livre affiché')
    })
    .catch((err: any) => {
      console.error('❌ Erreur d’affichage :', err)
    })
}

onMounted(async () => {
  if (TEST_MODE) {
        const testPath = 'http://localhost:3000/uploads/test/mobydick.epub'
    console.log('🧪 Mode test EPUB :', testPath)

    loading.value = false // ⬅️ d'abord, pour forcer l'affichage de <div id="reader">
    await nextTick()      // ⬅️ ensuite, pour attendre que le DOM s’ajuste
    initReader(testPath)
    return
  }

  const id = route.params.id as string
  if (!id) {
    router.push({ name: 'user-books' })
    return
  }

  await fetchBook(id)

  if (book.value) {
    console.log('📚 Livre chargé :', book.value)
    await nextTick() // 🧠 assure-toi que le DOM a fini de peindre
    initReader(book.value.epubPath)
  } else {
    console.warn('⚠️ Aucun livre trouvé après fetch')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white p-6 space-y-6">
    <RouterLink
      to="/user/books"
      class="inline-block mb-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
    >
      ← Retour à la bibliothèque
    </RouterLink>

    <div v-if="loading">Chargement du livre…</div>
    <div v-else-if="error" class="text-red-400">{{ error }}</div>

    <div v-else>
      <h1 class="text-2xl font-bold mb-2">{{ book?.title || 'Livre de test' }}</h1>
      <p class="text-gray-400 mb-4">{{ book?.author || 'inconnu' }}</p>

      <div
        id="reader"
        class="bg-white text-black rounded overflow-hidden"
        style="height: 100vh;"
      ></div>
    </div>
  </div>
</template>

<style scoped>
#reader {
  height: 90vh;
  width: 100%;
  overflow: hidden;
}
</style>
