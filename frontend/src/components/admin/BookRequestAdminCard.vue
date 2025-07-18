<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getBookRequests, fulfillRequest, rejectRequest } from '@/api/adminBookRequests'
import { deleteBookRequest } from '@/api/bookRequest'
import type { BookRequestWithUser } from '@/types/bookRequest'
import { useToast } from '@/composables/useToast'
import BaseConfirmModal from '@/components/ui/BaseConfirmModal.vue'

const requests = ref<BookRequestWithUser[]>([])
const loading = ref(false)
const error = ref('')
const confirmOpen = ref(false)
const requestToDelete = ref<BookRequestWithUser | null>(null)

const toast = useToast()

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
  try {
    await fulfillRequest(id, { fulfilledTitle: title, fulfilledAuthor: author })
    toast.success('📚 Marquée comme ajoutée')
    await fetchRequests()
  } catch (err: any) {
    toast.error(err.message || 'Erreur lors de la mise à jour')
  }
}

async function markAsRejected(id: string) {
  try {
    await rejectRequest(id)
    toast.success('🚫 Demande rejetée')
    await fetchRequests()
  } catch (err: any) {
    toast.error(err.message || 'Erreur lors du rejet')
  }
}

function confirmDelete(request: BookRequestWithUser) {
  requestToDelete.value = request
  confirmOpen.value = true
}

async function handleDelete() {
  if (!requestToDelete.value) return
  try {
    await deleteBookRequest(requestToDelete.value.id)
    toast.success('🗑 Demande supprimée')
    await fetchRequests()
  } catch (err) {
    toast.error('Erreur lors de la suppression')
    console.error(err)
  } finally {
    confirmOpen.value = false
    requestToDelete.value = null
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
          @click="() => confirmDelete(request)"
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
          @click="() => confirmDelete(request)"
          class="text-sm text-red-600 hover:underline"
        >
          Supprimer
        </button>
      </div>

      <div v-else-if="request.status === 'REJECTED'" class="flex justify-between items-center text-red-500 text-sm">
        <div>❌ Demande refusée</div>
        <button
          @click="() => confirmDelete(request)"
          class="text-sm text-red-600 hover:underline"
        >
          Supprimer
        </button>
      </div>
    </div>

    <BaseConfirmModal
      v-if="confirmOpen"
      title="Supprimer cette demande ?"
      message="Cette action est irréversible."
      confirm-label="Supprimer"
      cancel-label="Annuler"
      @confirm="handleDelete"
      @cancel="confirmOpen = false"
    />
  </div>
</template>
