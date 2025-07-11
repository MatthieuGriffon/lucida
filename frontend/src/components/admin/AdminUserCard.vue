<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  fetchUsers,
  createUser,
  changeUserPassword,
  deleteUser,
} from '@/api/adminUsers'
import { Trash2, KeyRound, ChevronDown, ChevronRight } from 'lucide-vue-next'
import BaseConfirmModal from '@/components/ui/BaseConfirmModal.vue'
import BasePromptModal from '@/components/ui/BasePromptModal.vue'
import { useToast } from '@/composables/useToast'

type User = {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

const users = ref<User[]>([])
const loading = ref(false)
const toast = useToast()

const showUserList = ref(false)
const showAddUser = ref(false)

const newUser = ref({
  name: '',
  email: '',
  password: '',
  role: 'USER' as 'USER' | 'ADMIN',
})

// modales
const confirmOpen = ref(false)
const promptOpen = ref(false)
const userToDelete = ref<User | null>(null)
const userToUpdate = ref<User | null>(null)
const newPassword = ref('')

async function loadUsers() {
  try {
    loading.value = true
    users.value = await fetchUsers()
  } catch (err: any) {
    toast.error(err.message || 'Erreur chargement utilisateurs')
  } finally {
    loading.value = false
  }
}

async function handleCreateUser() {
  try {
    await createUser(newUser.value)
    toast.success('Utilisateur ajouté ✅')
    Object.assign(newUser.value, { name: '', email: '', password: '', role: 'USER' })
    await loadUsers()
  } catch (err: any) {
    toast.error(err.message || 'Erreur lors de l’ajout')
  }
}

function confirmDelete(user: User) {
  userToDelete.value = user
  confirmOpen.value = true
}

async function handleDeleteConfirmed() {
  if (!userToDelete.value) return
  try {
    await deleteUser(userToDelete.value.id)
    toast.success('Utilisateur supprimé 🗑')
    await loadUsers()
  } catch (err: any) {
    toast.error(err.message || 'Erreur suppression')
  } finally {
    userToDelete.value = null
    confirmOpen.value = false
  }
}

function promptChangePassword(user: User) {
  userToUpdate.value = user
  newPassword.value = ''
  promptOpen.value = true
}

async function handlePasswordChangeConfirmed() {
  if (!userToUpdate.value || !newPassword.value.trim()) return
  try {
    await changeUserPassword(userToUpdate.value.id, newPassword.value.trim())
    toast.success('Mot de passe modifié 🔑')
  } catch (err: any) {
    toast.error(err.message || 'Erreur modification mot de passe')
  } finally {
    userToUpdate.value = null
    newPassword.value = ''
    promptOpen.value = false
  }
}

onMounted(loadUsers)
</script>

<template>
  <div class="bg-white text-gray-900 p-6 rounded-xl shadow-lg space-y-6 max-w-2xl w-full">
    <h2 class="text-xl font-semibold">Gestion des utilisateurs</h2>

    <!-- Liste des utilisateurs -->
    <div>
      <button
        @click="showUserList = !showUserList"
        class="flex items-center text-sm text-left font-semibold mb-2"
      >
        <component :is="showUserList ? ChevronDown : ChevronRight" class="w-4 h-4 mr-1" />
        Utilisateurs
      </button>

      <div v-show="showUserList" class="space-y-2 transition-all duration-200">
        <div
          v-for="user in users"
          :key="user.id"
          class="border p-4 rounded flex justify-between items-center"
        >
          <div>
            <div class="font-semibold">
              {{ user.name }}
              <span class="text-xs text-gray-500">({{ user.role }})</span>
            </div>
            <div class="text-sm text-gray-600">{{ user.email }}</div>
          </div>
          <div class="flex gap-1">
            <button
              @click="promptChangePassword(user)"
              class="bg-blue-600 text-white p-1.5 rounded hover:bg-blue-700"
              title="Changer le mot de passe"
            >
              <KeyRound class="w-3 h-3" />
            </button>
            <button
              @click="confirmDelete(user)"
              class="bg-red-600 text-white p-1.5 rounded hover:bg-red-700"
              title="Supprimer l’utilisateur"
            >
              <Trash2 class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Ajouter un utilisateur -->
    <div>
      <button
        @click="showAddUser = !showAddUser"
        class="flex items-center text-sm text-left font-semibold mb-2"
      >
        <component :is="showAddUser ? ChevronDown : ChevronRight" class="w-4 h-4 mr-1" />
        Ajouter un utilisateur
      </button>

      <form
        v-show="showAddUser"
        @submit.prevent="handleCreateUser"
        class="space-y-2 transition-all duration-200"
      >
        <input v-model="newUser.name" placeholder="Nom" required class="w-full p-2 border rounded" />
        <input v-model="newUser.email" placeholder="Email" type="email" required class="w-full p-2 border rounded" />
        <input v-model="newUser.password" placeholder="Mot de passe" type="password" required class="w-full p-2 border rounded" />
        <select v-model="newUser.role" class="w-full p-2 border rounded">
          <option value="USER">Utilisateur</option>
          <option value="ADMIN">Administrateur</option>
        </select>
        <button type="submit" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Ajouter
        </button>
      </form>
    </div>
  </div>

  <!-- Modale confirmation suppression -->
  <BaseConfirmModal
    v-if="confirmOpen"
    title="Supprimer cet utilisateur ?"
    message="Cette action est irréversible."
    confirm-label="Supprimer"
    cancel-label="Annuler"
    @confirm="handleDeleteConfirmed"
    @cancel="confirmOpen = false"
  />

  <!-- Modale changement mot de passe -->
  <BasePromptModal
    v-if="promptOpen"
    title="Nouveau mot de passe"
    placeholder="Mot de passe"
    :value="newPassword"
    @update:value="newPassword = $event"
    @confirm="handlePasswordChangeConfirmed"
    @cancel="promptOpen = false"
  />
</template>
