<script setup lang="ts">
import { ref } from 'vue'
import { changePassword } from '@/api/account'

const oldPassword = ref('')
const newPassword = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function submit() {
  loading.value = true
  error.value = ''
  success.value = false

  try {
    await changePassword(oldPassword.value, newPassword.value)
    success.value = true
    oldPassword.value = ''
    newPassword.value = ''
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submit" class="space-y-4 max-w-md mx-auto">
    <div>
      <label for="oldPassword" class="block font-medium mb-1">Mot de passe actuel</label>
      <input
        id="oldPassword"
        type="password"
        v-model="oldPassword"
        class="w-full p-2 border border-gray-300 rounded"
        required
      />
    </div>

    <div>
      <label for="newPassword" class="block font-medium mb-1">Nouveau mot de passe</label>
      <input
        id="newPassword"
        type="password"
        v-model="newPassword"
        class="w-full p-2 border border-gray-300 rounded"
        required
      />
    </div>

    <div class="text-red-600" v-if="error">{{ error }}</div>
    <div class="text-green-600" v-if="success">Mot de passe modifié avec succès ✅</div>

    <button
      type="submit"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      :disabled="loading"
    >
      {{ loading ? 'Modification...' : 'Changer le mot de passe' }}
    </button>
  </form>
</template>

<style scoped>
/* Sobre et accessible, rien à signaler ici */
</style>
