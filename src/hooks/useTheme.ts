import { useEffect } from 'react'
import { useProgress } from '@/store/progress'

/** Resolve a preference to the theme that will actually be painted. */
function resolve(pref: 'light' | 'dark' | null): 'light' | 'dark' {
  if (pref) return pref
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Writes the *resolved* theme to the document, so the stylesheet needs only
 *  one dark palette rather than a data-theme copy and a prefers-color-scheme
 *  copy that drift apart. `null` follows the OS, which is the default: a phone
 *  in night mode should open dark without anyone having to choose. */
export function useTheme() {
  const theme = useProgress((s) => s.theme)
  const setTheme = useProgress((s) => s.setTheme)

  useEffect(() => {
    const apply = () => {
      document.documentElement.setAttribute('data-theme', resolve(theme))
    }
    apply()
    if (theme) return
    // Only while following the OS does its preference need watching.
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [theme])

  return { theme, setTheme }
}

/** What is actually on screen right now, including when following the OS, so a
 *  toggle can flip the visible state rather than the stored preference. */
export function useResolvedTheme(): 'light' | 'dark' {
  const theme = useProgress((s) => s.theme)
  return resolve(theme)
}
