import { useState, useCallback } from 'react'
import { getTranslations, type Locale, type Translations } from './translations'

const STORAGE_KEY = 'oss-landscape-locale'

function getInitialLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'ko' || stored === 'en') return stored
  // Browser language detection
  const lang = navigator.language || ''
  if (lang.startsWith('ko')) return 'ko'
  return 'en'
}

export function useI18n() {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }, [])

  const t: Translations = getTranslations(locale)

  return { locale, setLocale, t }
}
