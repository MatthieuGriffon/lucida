import { defineStore } from 'pinia'
import { ref } from 'vue'
const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? `${location.protocol}//${location.hostname}:3000`

export const usePreferenceStore = defineStore('preference', () => {
  const fontSize = ref<string>('125%')
  const darkMode = ref<boolean>(false)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  async function fetchPreference() {
    loading.value = true
    error.value = null

    try {
      const res = await fetch(`${base}/api/user/preference`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Erreur de chargement des préférences')

      const data = await res.json()
      fontSize.value = data.fontSize
      darkMode.value = data.darkMode
    } catch (err: any) {
      console.error('⚠️ fetchPreference error', err)
      error.value = err?.message || 'Erreur réseau'
    } finally {
      loading.value = false
    }
  }

  async function updateFontSize(newSize: string) {
    try {
      fontSize.value = newSize // mise à jour immédiate pour réactivité
      const res = await fetch(`${base}/api/user/preference`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fontSize: newSize }),
      })

      if (!res.ok) throw new Error('Échec de la sauvegarde')
    } catch (err: any) {
      console.error('⚠️ updateFontSize error', err)
      error.value = err?.message || 'Erreur réseau'
    }
  }
   async function toggleDarkMode() {
    darkMode.value = !darkMode.value
    await savePreferences()
  }
  async function savePreferences() {
    try {
      const res = await fetch(`${base}/api/user/preference`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fontSize: fontSize.value, darkMode: darkMode.value }),
      })

      if (!res.ok) throw new Error('Échec de la sauvegarde')
    } catch (err: any) {
      console.error('⚠️ savePreferences error', err)
      error.value = err?.message || 'Erreur réseau'
    }
  }
  return {
  fontSize,
  darkMode,
  loading,
  error,
  fetchPreference,
  updateFontSize,
  toggleDarkMode, 
  savePreferences, 
}

})