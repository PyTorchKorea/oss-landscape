import { useState, useCallback, useEffect } from 'react'

export type ThemeSetting = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'oss-landscape-theme'

function getInitialSetting(): ThemeSetting {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

function resolveTheme(setting: ThemeSetting): ResolvedTheme {
  if (setting === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return setting
}

export function useTheme() {
  const [setting, setSettingState] = useState<ThemeSetting>(getInitialSetting)
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveTheme(setting))

  useEffect(() => {
    setResolved(resolveTheme(setting))

    if (setting !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setResolved(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [setting])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark')
  }, [resolved])

  const setSetting = useCallback((s: ThemeSetting) => {
    setSettingState(s)
    localStorage.setItem(STORAGE_KEY, s)
  }, [])

  return { setting, resolved, setSetting }
}
