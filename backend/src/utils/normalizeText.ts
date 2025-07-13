export function normalizeText(raw: string): string {
  return raw
    .normalize('NFKD')
    .replace(/[’‘‛‹›«»]/g, "'")
    .replace(/[‐-‒–—―]/g, '-')
    .replace(/[^\w\s'-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}