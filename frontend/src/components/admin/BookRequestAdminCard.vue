<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBookRequests, fulfillRequest, rejectRequest } from '@/api/adminBookRequests'
import { deleteBookRequest } from '@/api/bookRequest'
import type { BookRequestWithUser } from '@/types/bookRequest'

const requests = ref<BookRequestWithUser[]>([])
const loading = ref(false)
const error = ref('')

async function fetchRequests() {
  try {
    loading.value = true
    requests.value = await getBookRequests()
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement des demandes'
  } finally {
    loading.value = false
  }
}

async function markAsFulfilled(id: string, title: string, author?: string) {
  await fulfillRequest(id, {
    fulfilledTitle: title,
    fulfilledAuthor: author,
  })
  await fetchRequests()
}

async function markAsRejected(id: string) {
  await rejectRequest(id)
  await fetchRequests()
}
async function handleDelete(id: string) {
  const confirmed = confirm('Supprimer cette demande ?')
  if (!confirmed) return

  try {
    await deleteBookRequest(id)
    await fetchRequests()
  } catch (err) {
    alert('Erreur lors de la suppression.')
    console.error(err)
  }
}

onMounted(fetchRequests)
</script>

<template>
  <div class="bg-white text-gray-900 p-6 rounded-xl shadow space-y-4 max-w-2xl w-full">
    <h2 class="text-xl font-semibold">📚 Demandes de livres</h2>

    <div v-if="loading">Chargement...</div>
    <div v-if="error" class="text-red-600">{{ error }}</div>

    <div v-if="requests.length === 0" class="text-gray-500">Aucune demande en attente.</div>

    <div
      v-for="request in requests"
      :key="request.id"
      class="border-t border-gray-200 pt-4 space-y-2"
    >
      <div>
        <span class="font-semibold">{{ request.title }}</span>
        <span v-if="request.author"> — {{ request.author }}</span>
        <span class="text-sm text-gray-500 ml-2">par {{ request.user.name }}</span>
      </div>

      <div v-if="request.status === 'PENDING'" class="flex flex-wrap gap-2 items-center">
        <button
          @click="() => markAsFulfilled(request.id, request.title, request.author ?? undefined)"
          class="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1 rounded"
        >
          Marquer comme ajouté
        </button>
        <button
          @click="() => markAsRejected(request.id)"
          class="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
        >
          Rejeter
        </button>
        <button
          @click="() => handleDelete(request.id)"
          class="text-sm text-red-600 hover:underline"
        >
          🗑 Supprimer
        </button>
      </div>

      <div v-else-if="request.status === 'FULFILLED'" class="flex justify-between items-center text-green-700 text-sm">
        <div>
          ✅ Livre ajouté :
          <strong>{{ request.fulfilledBookTitle }}</strong>
          <span v-if="request.fulfilledBookAuthor"> — {{ request.fulfilledBookAuthor }}</span>
        </div>
        <button
          @click="() => handleDelete(request.id)"
          class="text-sm text-red-600 hover:underline"
        >
          Supprimer
        </button>
      </div>

      <div v-else-if="request.status === 'REJECTED'" class="flex justify-between items-center text-red-500 text-sm">
        <div>❌ Demande refusée</div>
        <button
          @click="() => handleDelete(request.id)"
          class="text-sm text-red-600 hover:underline"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
</template>
