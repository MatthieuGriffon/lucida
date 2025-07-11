<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/composables/useToast'

const email = ref('')
const password = ref('')

const userStore = useUserStore()
const router = useRouter()

const toast = useToast()

async function handleLogin() {
  const success = await userStore.login(email.value, password.value)

  if (!success) {
    if (userStore.error) {
      toast.error(userStore.error)
    }
    return
  }

  await userStore.fetchUser()

  if (!userStore.isAuthenticated) return

  if (userStore.role === 'ADMIN') {
    router.push('/admin')
  } else {
    router.push('/dashboard')
  }
}
</script>

<template>
  <div class="bg-neutral-900 text-white rounded-2xl shadow-2xl p-8 w-full font-sans">
    <h1 class="text-3xl font-semibold mb-8 text-center">Connexion</h1>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label for="email" class="block text-xl font-medium mb-2">Adresse e-mail</label>
        <input
          v-model="email"
          type="email"
          id="email"
          autocomplete="email"
          inputmode="email"
          class="w-full px-5 py-4 text-lg bg-black border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          required
          placeholder="exemple@domaine.fr"
        />
      </div>

      <div>
        <label for="password" class="block text-xl font-medium mb-2">Mot de passe</label>
        <input
          v-model="password"
          type="password"
          id="password"
          autocomplete="current-password"
          class="w-full px-5 py-4 text-lg bg-black border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
          required
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        :disabled="userStore.loading"
        class="w-full bg-blue-600 text-white text-xl font-semibold py-4 rounded-2xl transition duration-150 disabled:opacity-50"
      >
        Se connecter
      </button>

      <p v-if="userStore.error" class="text-lg text-red-400 text-center">
        {{ userStore.error }}
      </p>
    </form>
  </div>
</template>
