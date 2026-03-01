import { useState, useRef, useEffect } from 'react'
import type { Locale, Translations } from '../i18n/translations'

interface Props {
  locale: Locale
  onLocaleChange: (l: Locale) => void
  onToggleLegend: (rect: DOMRect) => void
  t: Translations
}

function Dropdown({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()

  const handleEnter = () => {
    clearTimeout(timeoutRef.current)
    setOpen(true)
  }
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return (
    <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      {trigger}
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl py-1 min-w-[88px] z-50">
          {children}
        </div>
      )}
    </div>
  )
}

function DropdownItem({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-center px-2 py-1.5 text-xs transition-colors ${
        selected
          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      {selected && '✓ '}{children}
    </button>
  )
}

export default function HeaderActions({
  locale,
  onLocaleChange,
  onToggleLegend,
  t,
}: Props) {
  const legendBtnRef = useRef<HTMLButtonElement>(null)

  const btnClass =
    'w-8 h-8 flex items-center justify-center rounded-md text-sm transition-colors ' +
    'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'

  const handleLegendClick = () => {
    if (legendBtnRef.current) {
      onToggleLegend(legendBtnRef.current.getBoundingClientRect())
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <button ref={legendBtnRef} onClick={handleLegendClick} className={btnClass} title={t.legend}>
        📊
      </button>

      <Dropdown
        trigger={
          <button className={btnClass + ' text-[0.65rem] font-bold'} title="Language">
            {locale === 'ko' ? '한' : 'EN'}
          </button>
        }
      >
        <DropdownItem selected={locale === 'ko'} onClick={() => onLocaleChange('ko')}>
          {t.langKo}
        </DropdownItem>
        <DropdownItem selected={locale === 'en'} onClick={() => onLocaleChange('en')}>
          {t.langEn}
        </DropdownItem>
      </Dropdown>
    </div>
  )
}
