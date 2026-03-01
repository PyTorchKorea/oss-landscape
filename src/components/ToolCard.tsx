import type { Tool } from '../types'

type SizeTier = 'lg' | 'md' | 'sm'

function getStarTier(stars?: number): SizeTier {
  if (!stars) return 'sm'
  if (stars >= 50000) return 'lg'
  if (stars >= 10000) return 'md'
  return 'sm'
}

function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(1)}k`
  return stars.toString()
}

const tierStyles: Record<SizeTier, { card: string; avatar: string; name: string }> = {
  lg: {
    card: 'w-28 h-14 border-2 border-blue-400 shadow-md hover:shadow-lg',
    avatar: 'w-8 h-8 text-sm bg-blue-500',
    name: 'text-xs font-bold',
  },
  md: {
    card: 'w-24 h-12 border border-gray-300 dark:border-gray-600 shadow hover:shadow-md',
    avatar: 'w-7 h-7 text-xs bg-purple-500',
    name: 'text-xs font-medium',
  },
  sm: {
    card: 'w-20 h-11 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow',
    avatar: 'w-6 h-6 text-xs bg-gray-400',
    name: 'text-xs',
  },
}

interface ToolCardProps {
  tool: Tool
}

export default function ToolCard({ tool }: ToolCardProps) {
  const tier = getStarTier(tool.meta?.stars)
  const styles = tierStyles[tier]
  const firstLetter = tool.name.charAt(0).toUpperCase()

  function handleClick() {
    if (tool.githubUrl) {
      window.open(tool.githubUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="relative group">
      <button
        onClick={handleClick}
        disabled={!tool.githubUrl}
        title={`${tool.name}\n${tool.description}\n⭐ ${tool.meta?.stars?.toLocaleString() ?? 'N/A'} • ${tool.license}`}
        className={`
          ${styles.card}
          flex items-center gap-1.5 p-1.5 rounded-md
          bg-white dark:bg-gray-800 cursor-pointer transition-all duration-150
          hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {/* Avatar */}
        <span
          className={`
            ${styles.avatar}
            flex-shrink-0 rounded-full flex items-center justify-center
            text-white font-semibold
          `}
        >
          {firstLetter}
        </span>

        {/* Info */}
        <span className="flex flex-col min-w-0 text-left">
          <span className={`${styles.name} truncate leading-tight text-gray-800 dark:text-gray-200`}>
            {tool.name}
          </span>
          {tool.meta?.stars ? (
            <span className="text-gray-400 leading-tight" style={{ fontSize: '0.6rem' }}>
              ⭐ {formatStars(tool.meta.stars)}
            </span>
          ) : null}
        </span>
      </button>
    </div>
  )
}
