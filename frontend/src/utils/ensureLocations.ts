import type ePub from 'epubjs'

/**
 * S’assure que `book.locations` existe dans l’IndexedDB d’ePub.js.
 */
export async function ensureLocations(
  book: ePub.Book,
  step: number = 1000,
) {
  // 1. attends que le livre soit prêt
  await book.ready
  console.log('[ensureLocations] book prêt, emplacements avant génération =', book.locations.length())

  // 2. si pas d’emplacements, génère et persiste
  if (!book.locations.length()) {
    console.log('[ensureLocations] génération des emplacements avec step =', step)
    await book.locations.generate(step)
    console.log('[ensureLocations] génération terminée, count =', book.locations.length())
  }
}

