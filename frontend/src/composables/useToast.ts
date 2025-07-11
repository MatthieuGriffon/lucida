import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export const toasts = ref<{ id: number; message: string; type: ToastType }[]>([])

let idCounter = 0

export function useToast() {
  function show(message: string, type: ToastType = 'info') {
    const id = idCounter++
    toasts.value.push({ id, message, type })

    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 4000)
  }

  return {
    success: (msg: string) => show(msg, 'success'),
    error: (msg: string) => show(msg, 'error'),
    info: (msg: string) => show(msg, 'info'),
  }
}
