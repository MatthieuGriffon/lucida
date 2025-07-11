export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // accents
    .replace(/[^a-z0-9]+/g, '-')                     // non-alphanum -> tirets
    .replace(/^-+|-+$/g, '')                         // nettoie les bords
}