import { useRef, useState, useEffect } from 'react'

import ResizeObserver from 'resize-observer-polyfill'

import type { Size } from '@/types'

export function useResize() {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState<Size>()

  useEffect(() => {
    const target = ref.current

    if (!target) return

    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    })
    observer.observe(target)

    return () => {
      observer.unobserve(target)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.current])

  return {
    ref,
    size,
  }
}
