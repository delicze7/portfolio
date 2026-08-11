import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { content } from '../content.js'

const STORAGE_KEY = 'portfolio:lang'
const LanguageContext = createContext(null)

function initialLang() {
  if (typeof window === 'undefined') return 'en'
  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'bs') return saved
  // Serve locals their language, everyone else English.
  return navigator.language?.toLowerCase().startsWith('bs') ? 'bs' : 'en'
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(initialLang)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'bs' : 'en')), [])

  const value = useMemo(() => ({ lang, setLang, toggle, t: content[lang] }), [lang, toggle])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
