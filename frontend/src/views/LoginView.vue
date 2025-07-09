<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const error = ref('')

function handleLogin() {
  error.value = ''
  console.log('Tentative de login avec :', email.value, password.value)

  // Pour test visuel :
  // error.value = 'Identifiants incorrects'
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
        class="w-full bg-blue-600 text-white text-xl font-semibold py-4 rounded-2xl active:bg-blue-700 hover:bg-blue-700 transition duration-150"
      >
        Se connecter
      </button>

      <p v-if="error" class="text-lg text-red-400 text-center">
        {{ error }}
      </p>
    </form>
  </div>
</template>
