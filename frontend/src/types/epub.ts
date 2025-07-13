import type ePub from 'epubjs'

export type EpubBook = ReturnType<typeof ePub>

export type EpubLocation = {
  start: {
    cfi: string
    index?: number
    href?: string
  }
  end?: {
    cfi: string
    index?: number
    href?: string
  }
  percentage?: number
  displayed?: {
    page: number
    total: number
  }
}

export type EpubRendition = {
  display: (target?: string) => Promise<void>
  next: () => Promise<void>
  prev: () => Promise<void>
  on: (
    event: 'relocated' | 'rendered',
    callback: (location: EpubLocation) => void
  ) => void
  currentLocation: () => EpubLocation | null
  resize: () => void
}