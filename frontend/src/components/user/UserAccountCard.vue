<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { logout as logoutAPI, changePassword, deleteAccount } from '@/api/account'
import { useToast } from '@/composables/useToast'
import BaseConfirmModal from '@/components/ui/BaseConfirmModal.vue'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const showChangePassword = ref(false)
const showDeleteAccount = ref(false)
const confirmDeleteOpen = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const passwordToDelete = ref('')

const loading = ref(false)

const doLogout = async () => {
  loading.value = true
  try {
    await logoutAPI()
    await userStore.logout()
    router.push('/')
    toast.success('Déconnexion réussie')
  } catch {
    toast.error('Erreur lors de la déconnexion.')
  } finally {
    loading.value = false
  }
}

const submitChangePassword = async () => {
  loading.value = true
  try {
    await changePassword(oldPassword.value, newPassword.value)
    toast.success('🔒 Mot de passe modifié')
    oldPassword.value = ''
    newPassword.value = ''
    showChangePassword.value = false
  } catch (err: any) {
    toast.error(err.message || 'Erreur inconnue')
  } finally {
    loading.value = false
  }
}

const submitDeleteAccount = async () => {
  confirmDeleteOpen.value = false
  loading.value = true
  try {
    await deleteAccount(passwordToDelete.value)
    await userStore.logout()
    router.push('/')
    toast.success('Compte supprimé avec succès')
  } catch (err: any) {
    toast.error(err.message || 'Échec de la suppression')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-gray-900 text-white p-6 rounded-xl shadow space-y-4 max-w-md w-full">
    <h2 class="text-xl font-semibold">Mon compte</h2>

    <div class="space-y-2">
      <!-- Déconnexion -->
      <button @click="doLogout" :disabled="loading"
              class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded">
        Se déconnecter
      </button>

      <!-- Changement mot de passe -->
      <button @click="showChangePassword = !showChangePassword" :disabled="loading"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
        {{ showChangePassword ? 'Annuler' : 'Changer mon mot de passe' }}
      </button>

      <div v-if="showChangePassword" class="space-y-2">
        <input
          type="password"
          v-model="oldPassword"
          placeholder="Ancien mot de passe"
          class="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400"
        />
        <input
          type="password"
          v-model="newPassword"
          placeholder="Nouveau mot de passe"
          class="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400"
        />
        <button @click="submitChangePassword" :disabled="loading"
                class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
          Valider
        </button>
      </div>

      <!-- Suppression compte -->
      <button
        @click="showDeleteAccount ? confirmDeleteOpen = true : showDeleteAccount = true"
        :disabled="loading"
        class="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
      >
        {{ showDeleteAccount ? 'Confirmer la suppression' : 'Supprimer mon compte' }}
      </button>

      <div v-if="showDeleteAccount" class="space-y-2">
        <input
          type="password"
          v-model="passwordToDelete"
          placeholder="Mot de passe"
          class="w-full p-2 rounded bg-gray-800 text-white placeholder-gray-400"
        />
      </div>
    </div>
  </div>

  <!-- Modale de confirmation -->
  <BaseConfirmModal
    v-if="confirmDeleteOpen"
    title="Supprimer ton compte ?"
    message="Cette action est irréversible. Es-tu sûr(e) de vouloir continuer ?"
    confirm-label="Supprimer"
    cancel-label="Annuler"
    @confirm="submitDeleteAccount"
    @cancel="confirmDeleteOpen = false"
  />
</template>
