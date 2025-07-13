<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { useRoute, useRouter }                      from 'vue-router'
import ePub                                         from 'epubjs'

import { ensureLocations }             from '@/utils/ensureLocations'
import { saveProgress, fetchProgress } from '@/api/progress'

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
  readerHeight.value = Math.max(window.innerHeight - header - 48, 200)
  console.log('[updateReaderHeight] readerHeight =', readerHeight.value)
}

async function fetchBook(id: string) {
  console.log('[fetchBook] start for', id)
  loading.value = true; error.value = ''
  try {
    const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
               ?? `${location.protocol}//${location.hostname}:3000`
    const res = await fetch(`${base}/api/books/${id}`, { credentials:'include' })
    if (!res.ok) throw new Error((await res.json()).message)
    book.value = await res.json()
    console.log('[fetchBook] loaded book =', book.value)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur inconnue'
    console.error('[fetchBook] error', e)
  } finally {
    loading.value = false
    console.log('[fetchBook] done, loading=', loading.value)
  }
}

async function safeDisplay(r: ePub.Rendition, cfi?: string) {
  console.log('[safeDisplay] début, CFI =', cfi)
  try {
    cfi ? await r.display(cfi) : await r.display()
    console.log('[safeDisplay] affichage OK')
  } catch (err) {
    console.warn('[safeDisplay] fallback display', err)
    await r.display()
  }
}

/*initReader corrigé*/
async function initReader(currentBook: { id: string; epubPath: string }) {
  console.log('[initReader] start for', currentBook.id);

  // 1. Instanciation du livre et génération des emplacements
  const bookEpub = ePub(currentBook.epubPath);
  await ensureLocations(bookEpub);
  console.log('[initReader] locations count =', bookEpub.locations.length());

  // 2. Récupération de la progression stockée
  const stored = await fetchProgress(currentBook.id);
  console.log('[initReader] stored loc =', stored);

  // 3. Calcul du CFI de départ
  let startCfi: string | undefined;
  if (
    stored != null &&
    stored >= 0 &&
    stored < bookEpub.locations.length()
  ) {
    startCfi = bookEpub.locations.cfiFromLocation(stored);
  }
  console.log('[initReader] startCfi =', startCfi);

  // 4. Création du rendu et exposition pour navigation
  const rend = bookEpub.renderTo('reader', {
    width: '100%',
    height: readerHeight.value,
  });
  rendition.value = rend;
  console.log('[initReader] rendition créé');

  // 5. Attache le listener AVANT display et ignore le premier relocated
  let ignoreFirst = true;
  let lastLoc = stored ?? 0;

  rend.on('relocated', (loc: { start: { location: number } }) => {
    if (ignoreFirst) {
      console.log('[relocated] (initial ignoré)');
      ignoreFirst = false;
      return;
    }

    const idx = loc.start.location ?? -1;
    const max = bookEpub.locations.length() - 1;
    console.log('[relocated] idx =', idx, '/', max);

    if (idx >= 0 && idx <= max && idx !== lastLoc) {
      lastLoc = idx;
      console.log('[relocated] saveProgress(', idx, ')');
      saveProgress(currentBook.id, idx)
        .then(() => console.log('[progress] saved'))
        .catch(console.error);
    }
  });
  console.log('[initReader] listener “relocated” attaché (avec ignoreFirst)');

  // 6. Affichage initial
  await safeDisplay(rend, startCfi);
  console.log('[initReader] affichage initial fait');

  // 7. On est prêt à naviguer
  isReady.value = true;
  console.log('[initReader] terminé, isReady =', isReady.value);
}

/*navigation*/
const nextPage = () => { console.log('[nav] nextPage'); rendition.value?.next() }
const prevPage = () => { console.log('[nav] prevPage'); rendition.value?.prev() }

/*lifecycle*/
onMounted(async () => {
  console.log('[onMounted] start')
  await nextTick()
  updateReaderHeight()
  window.addEventListener('resize', updateReaderHeight)

  const id = route.params.id as string
  console.log('[onMounted] bookId =', id)
  if (!id) return router.push({ name:'user-books' })

  await fetchBook(id)
  if (!book.value) return

  await nextTick()
  await initReader(book.value)
  console.log('[onMounted] initReader finished')
})

onBeforeUnmount(() => {
  console.log('[onBeforeUnmount] cleanup')
  window.removeEventListener('resize', updateReaderHeight)
  if (rendition.value?.destroy) {
    rendition.value.destroy()
    rendition.value = undefined
    console.log('[onBeforeUnmount] rendition détruit')
  }
})
</script>

<template>
  <div class="h-[98vh] bg-gray-900 text-white flex flex-col p-6 overflow-hidden">
    <div ref="headerRef">
      <RouterLink to="/user/books" class="inline-block mb-4 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg">
        ← Retour à la bibliothèque
      </RouterLink>
      <h1 class="text-xl font-bold">{{ book?.title }}</h1>
      <p class="text-gray-400">{{ book?.author || 'Auteur inconnu' }}</p>
    </div>
    <div id="reader-container" class="relative flex-grow">
      <div id="reader" class="bg-white text-black rounded h-full"></div>
      <div class="absolute left-0 top-0 h-full w-1/3 z-10" @click="prevPage"/>
      <div class="absolute right-0 top-0 h-full w-1/3 z-10" @click="nextPage"/>
    </div>
  </div>
</template>

<style scoped>
#reader-container { height:100% }
#reader            { width:100%; height:100%; overflow:hidden }
#reader iframe     { width:100%!important; height:100%!important; border:none }
html, body        { overflow:hidden }
</style>
