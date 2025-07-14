<script setup lang="ts">
import BookRequestCard from '@/components/user/BookRequestCard.vue'
import UserAccountCard from '@/components/user/UserAccountCard.vue'
</script>

<template>
  <div class="p-4 sm:p-6">
    <div class="max-w-5xl mx-auto space-y-12">
      
      <!-- 🟩 Cartes utilisateur -->
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-center gap-6">
        <div class="flex-1 min-w-[280px] max-w-[400px]">
          <BookRequestCard />
        </div>
        <div class="flex-1 min-w-[280px] max-w-[400px]">
          <UserAccountCard />
        </div>
      </div>

      <!-- 📚 Accès bibliothèque + Aide -->
      <div class="text-center space-y-8">
        <RouterLink
          to="/user/books"
          class="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl text-xl font-bold shadow-md"
        >
          📚 Accéder à la bibliothèque
        </RouterLink>

        <div
          class="bg-white dark:bg-gray-800 border mt-9 border-gray-300 dark:border-gray-700 rounded-xl p-6 max-w-3xl mx-auto text-left shadow-sm text-gray-800 dark:text-gray-100 text-base leading-relaxed space-y-4"
        >
          <h2 class="text-3xl font-bold mb-2 text-gray-900 dark:text-white">🧭 Aide rapide</h2>
          <div class="text-2xl space-y-4">
          <p><strong>📖 Lire un livre :</strong> appuie sur le bouton <em>Lire</em> à côté d’un livre pour l’ouvrir.</p>
          <p><strong>🔠 Taille du texte :</strong> pendant la lecture, utilise les boutons + et − en haut à droite pour ajuster.</p>
          <p><strong>🌙 Mode clair/sombre :</strong> utilise le bouton ☀️ / 🌙 en haut de l’écran de lecture selon ta préférence.</p>
          <p><strong>📍 Reprise automatique :</strong> la lecture reprendra là où tu t’étais arrêté(e), sans rien faire.</p>
          <p><strong>📬 Demande de livre :</strong> clique sur <em>Demander un livre</em> dans ton tableau de bord pour suggérer un nouveau titre.</p>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>