<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { submitBookRequest, getUserBookRequests, deleteBookRequest, type BookRequest } from '@/api/bookRequest'

const title = ref('')
const author = ref('')
const successMessage = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

const requests = ref<BookRequest[]>([])

async function fetchRequests() {
  requests.value = await getUserBookRequests()
}

async function handleSubmit() {
  successMessage.value = ''
  errorMessage.value = ''

  if (!title.value.trim()) {
    errorMessage.value = 'Le titre est obligatoire.'
    return
  }

  isSubmitting.value = true

  const result = await submitBookRequest({
    title: title.value.trim(),
    author: author.value.trim() || undefined,
  })

  isSubmitting.value = false

  if (result.success) {
    successMessage.value = '📚 Demande enregistrée avec succès !'
    title.value = ''
    author.value = ''
    await fetchRequests()
  } else {
    errorMessage.value = result.message || 'Erreur lors de l’envoi.'
  }
}
async function handleDelete(id: string) {
  const confirmed = confirm('Supprimer cette demande ?')
  if (!confirmed) return

  try {
    await deleteBookRequest(id)
    requests.value = requests.value.filter(r => r.id !== id)
  } catch (error) {
    alert('Erreur lors de la suppression.')
    console.error(error)
  }
}
onMounted(fetchRequests)
</script>

<template>
  <div class="bg-gray-900 text-white p-4 rounded-xl space-y-4">
    <h2 class="text-lg font-semibold">Demander un livre</h2>

    <div class="space-y-2">
      <input
        v-model="title"
        type="text"
        placeholder="Titre du livre"
        class="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400"
      />
      <input
        v-model="author"
        type="text"
        placeholder="Auteur (facultatif)"
        class="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400"
      />
    </div>

    <button
      @click="handleSubmit"
      :disabled="isSubmitting"
      class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded w-full disabled:opacity-50"
    >
      Envoyer la demande
    </button>

    <div v-if="successMessage" class="text-green-400 text-sm">{{ successMessage }}</div>
    <div v-if="errorMessage" class="text-red-400 text-sm">{{ errorMessage }}</div>

    <div v-if="requests.length" class="pt-6 border-t border-gray-700 space-y-2">
  <h3 class="text-base font-semibold text-white">📚 Vos demandes</h3>
  <ul
  class="space-y-2 max-h-64 overflow-y-auto pr-1"
  style="scrollbar-width: thin; scrollbar-color: #4b5563 transparent;"
>
  <li
  v-for="r in requests"
  :key="r.id"
  class="bg-gray-800 rounded-lg p-3 flex justify-between items-start shadow-sm"
>
  <div class="flex-1">
    <div class="text-white font-semibold">
      {{ r.title }}
      <span v-if="r.author" class="text-gray-400 font-normal"> — {{ r.author }}</span>
    </div>
    <div class="text-xs mt-1 text-gray-400">
      {{ new Date(r.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'short' }) }}
    </div>
  </div>

  <div class="flex flex-col items-end gap-1">
    <div
      class="text-xs px-2 py-1 rounded-full font-medium"
      :class="{
        'bg-green-800 text-green-300': r.status === 'FULFILLED',
        'bg-yellow-800 text-yellow-300': r.status === 'PENDING',
        'bg-red-800 text-red-300': r.status === 'REJECTED',
      }"
    >
      {{
        r.status === 'FULFILLED'
          ? 'ajouté'
          : r.status === 'REJECTED'
          ? 'refusé'
          : 'en attente'
      }}
    </div>

    <button
      @click="handleDelete(r.id)"
      class="text-red-400 text-xs hover:underline mt-1"
    >
      🗑 Supprimer
    </button>
  </div>
</li>
</ul>
    </div>

    <div v-else class="text-gray-500 text-sm">
      Vous n’avez pas encore fait de demande de livre.
    </div>
  </div>
</template>