<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { logout as logoutAPI, changePassword, deleteAccount } from '@/api/account'

const router = useRouter()
const userStore = useUserStore()

const showChangePassword = ref(false)
const showDeleteAccount = ref(false)

const oldPassword = ref('')
const newPassword = ref('')
const passwordToDelete = ref('')

const message = ref('')
const error = ref('')
const loading = ref(false)

const doLogout = async () => {
  loading.value = true
  try {
    await logoutAPI()
    await userStore.logout()
    router.push('/')
  } catch {
    error.value = 'Erreur lors de la déconnexion.'
  } finally {
    loading.value = false
  }
}

const submitChangePassword = async () => {
  error.value = ''
  message.value = ''
  loading.value = true

  try {
    await changePassword(oldPassword.value, newPassword.value)
    message.value = '✅ Mot de passe modifié'
    oldPassword.value = ''
    newPassword.value = ''
    showChangePassword.value = false
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const submitDeleteAccount = async () => {
  const confirmed = confirm('❌ Supprimer ton compte ? Cette action est irréversible.')
  if (!confirmed) return

  error.value = ''
  message.value = ''
  loading.value = true

  try {
    await deleteAccount(passwordToDelete.value)
    await userStore.logout()
    router.push('/')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-white text-gray-900 p-6 rounded-xl shadow-lg space-y-4 max-w-md w-full">
    <h2 class="text-xl font-semibold">Actions de compte</h2>

    <div class="space-y-2">
      <button @click="doLogout" :disabled="loading" class="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
        Se déconnecter
      </button>

      <button @click="showChangePassword = !showChangePassword" :disabled="loading"
              class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        {{ showChangePassword ? 'Annuler' : 'Changer mon mot de passe' }}
      </button>

      <div v-if="showChangePassword" class="space-y-2">
        <input
          type="password"
          v-model="oldPassword"
          placeholder="Ancien mot de passe"
          class="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          v-model="newPassword"
          placeholder="Nouveau mot de passe"
          class="w-full p-2 border border-gray-300 rounded"
        />
        <button @click="submitChangePassword" :disabled="loading"
                class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Valider
        </button>
      </div>

      <button @click="showDeleteAccount = !showDeleteAccount" :disabled="loading"
              class="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700">
        {{ showDeleteAccount ? 'Annuler' : 'Supprimer mon compte' }}
      </button>

      <div v-if="showDeleteAccount" class="space-y-2">
        <input
          type="password"
          v-model="passwordToDelete"
          placeholder="Mot de passe"
          class="w-full p-2 border border-gray-300 rounded"
        />
        <button @click="submitDeleteAccount" :disabled="loading"
                class="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800">
          Supprimer
        </button>
      </div>
    </div>

    <div v-if="message" class="text-green-600 font-medium">{{ message }}</div>
    <div v-if="error" class="text-red-600 font-medium">{{ error }}</div>
  </div>
</template>
