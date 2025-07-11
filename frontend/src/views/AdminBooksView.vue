<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { uploadBookFile, createBook } from '@/api/adminBooks'

const router = useRouter()

function goBack() {
  router.push({ name: 'admin' })
}

const title = ref('')
const author = ref('')
const file = ref<File | null>(null)

const uploading = ref(false)
const uploadError = ref('')

function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  file.value = target?.files?.[0] ?? null
}

async function handleAddBook() {
  if (!title.value || !file.value) {
    uploadError.value = 'Le titre et le fichier sont obligatoires.'
    return
  }

  uploading.value = true
  uploadError.value = ''

  try {
    console.log('📦 Préparation du FormData…')

    const formData = new FormData()
    const epubFile = file.value
    if (!epubFile) throw new Error('Fichier manquant au moment de l’envoi')

    formData.append('file', epubFile)
    formData.append('title', title.value)
    formData.append('author', author.value)

    console.log('📡 Envoi du fichier au backend…')
    const { epubPath } = await uploadBookFile(formData)

    console.log('✅ Upload réussi, création du livre avec chemin :', epubPath)

    await createBook({
      title: title.value,
      author: author.value,
      epubPath,
    })

    console.log('📚 Livre enregistré en base')

    // On évite de rediriger tant que tout est bien fini
    title.value = ''
    author.value = ''
    file.value = null

    // Tu peux remettre ça à la fin si tout marche
    // router.push({ name: 'admin' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    uploadError.value = message
    console.error('❌ Erreur pendant handleAddBook :', err)
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="p-4 sm:p-6 max-w-3xl mx-auto space-y-8">

    <!-- Bouton retour -->
    <div>
      <button
        @click="goBack"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
      >
        ← Retour
      </button>
    </div>

    <!-- Titre principal -->
    <h1 class="text-3xl font-bold text-gray-900">Gestion de la bibliothèque</h1>

    <!-- Formulaire d'ajout -->
    <div class="bg-gray-800 text-white p-6 rounded-xl shadow space-y-6">
      <h2 class="text-2xl font-semibold">Ajouter un nouveau livre</h2>

      <form @submit.prevent="handleAddBook" class="space-y-4">
        <div>
          <label class="block mb-1">Titre *</label>
          <input v-model="title" type="text" class="w-full p-2 rounded bg-gray-900 border border-gray-600" required />
        </div>

        <div>
  <label class="block mb-1">Auteur</label>
  <input
    v-model="author"
    type="text"
    class="w-full p-2 rounded bg-gray-900 border border-gray-600"
  />
</div>

<div>
  <label class="block mb-1">Fichier EPUB *</label>
  <input
    type="file"
    accept=".epub"
    @change="onFileChange"
    class="text-white"
  />
</div>

        <div v-if="uploadError" class="text-red-400 text-sm">{{ uploadError }}</div>

        <button
          type="submit"
          :disabled="uploading"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
        >
          {{ uploading ? 'Envoi en cours…' : 'Ajouter le livre' }}
        </button>
      </form>
    </div>

  </div>
</template>
