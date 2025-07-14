<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { useRoute, useRouter }                      from 'vue-router'
import { watch } from 'vue'
import FontSizeControl from '@/components/ui/FontSizeControl.vue'
import { usePreferenceStore } from '@/stores/preferences'
import DarkModeToggle from '@/components/user/DarkModeToggle.vue'

import ePub                                         from 'epubjs'

import { ensureLocations }             from '@/utils/ensureLocations'
import { saveProgress, fetchProgress } from '@/api/progress'

// Import the preference store
const preferenceStore = usePreferenceStore()

/*’état*/
const route       = useRoute()
const router      = useRouter()
const book        = ref<{ id:string; title:string; author?:string; epubPath:string }>()
const rendition   = ref<ReturnType<typeof ePub.prototype.renderTo>>()
const isReady     = ref(false)
const loading     = ref(true)
const error       = ref('')
const headerRef   = ref<HTMLElement>()
const readerHeight= ref(0)

/*helpers*/
function updateReaderHeight() {
  const header = headerRef.value?.offsetHeight ?? 0
  const safetyMargin = 32
  readerHeight.value = window.innerHeight - header - safetyMargin
}

async function fetchBook(id: string) {
  loading.value = true; error.value = ''
  try {
    const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
               ?? `${location.protocol}//${location.hostname}:3000`
    const res = await fetch(`${base}/api/books/${id}`, { credentials:'include' })
    if (!res.ok) throw new Error((await res.json()).message)
    book.value = await res.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur inconnue'
    console.error('[fetchBook] error', e)
  } finally {
    loading.value = false
  }
}

async function safeDisplay(r: ePub.Rendition, cfi?: string) {
  try {
    cfi ? await r.display(cfi) : await r.display()
  } catch (err) {
    await r.display()
  }
}

async function initReader(currentBook: { id: string; epubPath: string }) {
  const bookEpub = ePub(currentBook.epubPath);
  await ensureLocations(bookEpub);

  const stored = await fetchProgress(currentBook.id);
  let startCfi: string | undefined;

  if (
    stored != null &&
    stored >= 0 &&
    stored < bookEpub.locations.length()
  ) {
    startCfi = bookEpub.locations.cfiFromLocation(stored);
  }

  const rend = bookEpub.renderTo('reader', {
    width: '100%',
    height: readerHeight.value,
  });

  rendition.value = rend;

  // 💡 Charger les préférences
  await preferenceStore.fetchPreference();

  // 💡 Appliquer la taille de police
rend.themes.fontSize(preferenceStore.fontSize);
rend.themes.font("Atkinson Hyperlegible, sans-serif");
// 💡 Appliquer le thème complet : couleurs + font
rend.themes.register('lucida-theme', `
  html, body {
    background: ${preferenceStore.darkMode ? '#111827' : '#ffffff'};
    color: ${preferenceStore.darkMode ? '#f9fafb' : '#111827'};
    line-height: 1.6;
    margin: 0;
    padding: 0;
  }
  body {
    padding-bottom: 6rem;
    margin-bottom: 12rem;
  }
  p {
    margin-bottom: 2em;
  }
`);
rend.themes.select('lucida-theme');

// 💡 Sécurisation : injecter <link> vers la font dans chaque iframe EPUB
rend.on('content.documentLoaded', (doc: Document) => {
  const head = doc.querySelector('head');
  if (head && !head.querySelector('link[href="/fonts/lucida-font.css"]')) {
    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/fonts/lucida-font.css';
    head.appendChild(link);
  }
});

  // 💡 Suivi de la progression de lecture
  let ignoreFirst = true;
  let lastLoc = stored ?? 0;

  rend.on('relocated', (loc: { start: { location: number } }) => {
    if (ignoreFirst) {
      ignoreFirst = false;
      return;
    }

    const idx = loc.start.location ?? -1;
    const max = bookEpub.locations.length() - 1;

    if (idx >= 0 && idx <= max && idx !== lastLoc) {
      lastLoc = idx;
      saveProgress(currentBook.id, idx)
        .then(() => console.log('[progress] saved'))
        .catch(console.error);
    }
  });

  // 💡 Affichage initial
  await safeDisplay(rend, startCfi);

  // 💡 On est prêt
  isReady.value = true;
}

/*navigation*/
const nextPage = () => { console.log('[nav] nextPage'); rendition.value?.next() }
const prevPage = () => { console.log('[nav] prevPage'); rendition.value?.prev() }

/*lifecycle*/
onMounted(async () => {
  await nextTick()
  updateReaderHeight()
  window.addEventListener('resize', updateReaderHeight)

  const id = route.params.id as string
  if (!id) return router.push({ name:'user-books' })

  await fetchBook(id)
  if (!book.value) return

  await nextTick()
  await initReader(book.value)
})

watch(() => preferenceStore.fontSize, (newSize) => {
  if (rendition.value) {
    rendition.value.themes.fontSize(newSize)
  }
})
watch(() => preferenceStore.darkMode, (isDark) => {
 rendition.value?.themes.register('lucida-theme', `
   body {
    background: ${isDark ? '#111827' : '#ffffff'};
    color: ${isDark ? '#f9fafb' : '#111827'};
    line-height: 1.6;
    padding-bottom: 12rem;
  }
`)
rendition.value?.themes.select('lucida-theme')
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateReaderHeight)
  if (rendition.value?.destroy) {
    rendition.value.destroy()
    rendition.value = undefined
  }
})
</script>
<template>
  <div class="h-screen bg-gray-900 text-white flex flex-col overflow-hidden ">
    <div ref="headerRef" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-2">
  <div class="flex items-center gap-2 flex-wrap">
    <button
      @click="router.push({ name: 'user-books' })"
      aria-label="Retour à la bibliothèque"
      class="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white rounded p-1"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    <p class="text-lg font-bold">{{ book?.title }}</p>
    <p class="text-gray-400">{{ book?.author || 'Auteur inconnu' }}</p>
  </div>

  <div class="flex items-center gap-2 mt-2 sm:mt-0">
    <FontSizeControl />
    <DarkModeToggle />
  </div>
</div>

    <div id="reader-container" class="relative flex-grow overflow-hidden mb-[30px] " > 
      <div id="reader" class="bg-white text-black w-full h-full rounded overflow-hidden "  />
      <div class="absolute left-0 top-0 h-full w-1/3 z-10" @click="prevPage" />
      <div class="absolute right-0 top-0 h-full w-1/3 z-10" @click="nextPage" />
    </div>
  </div>
</template>

<style scoped>
#reader iframe {
  width: 100% !important;
  height: 100% !important;
  border: none;
  
}
.epubjs-container {
  width: 100% !important;
  height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  overflow: auto !important; 
}
</style>