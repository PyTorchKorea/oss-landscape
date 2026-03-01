export type Locale = 'ko' | 'en'

export function formatRelativeTime(dateStr: string | undefined, locale: Locale = 'ko'): string {
  if (!dateStr) return locale === 'ko' ? '알 수 없음' : 'Unknown'

  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (locale === 'ko') {
    if (minutes < 1) return '방금 전'
    if (minutes < 60) return `${minutes}분 전`
    if (hours < 24) return `${hours}시간 전`
    if (days < 7) return `${days}일 전`
    if (days < 30) return `${Math.floor(days / 7)}주 전`
    if (months < 12) return `${months}달 전`
    return `${years}년 전`
  }

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (months < 12) return `${months}mo ago`
  return `${years}y ago`
}
