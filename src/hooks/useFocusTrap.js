import { useEffect, useRef } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function useFocusTrap(actif, onClose) {
  const ref = useRef(null)

  useEffect(() => {
    if (!actif) return

    const node = ref.current
    const previouslyFocused = document.activeElement

    const focusables = () => {
      if (!node) return []
      return Array.from(node.querySelectorAll(FOCUSABLE)).filter(el => el.offsetParent !== null || el === document.activeElement)
    }

    const first = () => focusables()[0]
    const last = () => focusables()[focusables().length - 1]

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose?.()
        return
      }
      if (e.key !== 'Tab') return
      const list = focusables()
      if (list.length === 0) { e.preventDefault(); return }
      const current = list.indexOf(document.activeElement)
      if (e.shiftKey && (current <= 0)) {
        e.preventDefault()
        list[list.length - 1].focus()
      } else if (!e.shiftKey && (current === list.length - 1 || current === -1)) {
        e.preventDefault()
        list[0].focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    requestAnimationFrame(() => { (first() || node)?.focus?.() })

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [actif, onClose])

  return ref
}
