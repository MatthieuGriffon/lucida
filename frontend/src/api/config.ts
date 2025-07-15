export const BASE_API_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ??
  `${location.protocol}//${location.hostname}:3000`
