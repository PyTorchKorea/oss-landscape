import { useState, useMemo } from 'react'
import { Treemap, ResponsiveContainer } from 'recharts'
import {
  moduleColors,
  getAgeBrightness,
  darkenColor,
} from '../utils/treemapColors'
import { formatRelativeTime, type Locale } from '../utils/relativeTime'
import type { Translations } from '../i18n/translations'
import type { Tool, Module, Category } from '../types'

// ── Custom treemap cell renderer ────────────────────────────────────────────

interface ContentProps {
  x?: number
  y?: number
  width?: number
  height?: number
  depth?: number
  name?: string
  moduleId?: string
  toolId?: string
  lastUpdated?: string
  githubUrl?: string
  description?: string
  onHover?: (info: TooltipInfo, clientX: number, clientY: number) => void
  onLeave?: () => void
  onClick?: (githubUrl: string) => void
}

function TreemapContent(props: ContentProps) {
  const {
    x = 0, y = 0, width = 0, height = 0,
    depth, name, moduleId, lastUpdated, githubUrl, description,
    onHover, onLeave, onClick,
  } = props

  if (width < 2 || height < 2) return null

  const baseColor = moduleId ? (moduleColors[moduleId] ?? '#666') : '#333'
  const brightness = getAgeBrightness(lastUpdated)
  const cellColor = darkenColor(baseColor, brightness)

  if (depth === 1) {
    return (
      <g>
        <rect x={x} y={y} width={width} height={height}
          fill={baseColor} stroke="#fff" strokeWidth={2} opacity={0.95} />
        {width > 60 && height > 20 && (
          <foreignObject x={x + 4} y={y + 2} width={width - 8} height={20}>
            <div style={{
              color: 'white', fontSize: 12, fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {name}
            </div>
          </foreignObject>
        )}
      </g>
    )
  }

  if (depth === 2) {
    return (
      <g>
        <rect x={x} y={y} width={width} height={height}
          fill={baseColor} stroke="#fff" strokeWidth={1} opacity={0.8} />
        {width > 50 && height > 16 && (
          <foreignObject x={x + 2} y={y + 1} width={width - 4} height={14}>
            <div style={{
              color: 'white', fontSize: 10,
              textShadow: '1px 1px 1px rgba(0,0,0,0.5)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {name}
            </div>
          </foreignObject>
        )}
      </g>
    )
  }

  if (depth === 3) {
    const area = width * height
    const fontSize = Math.min(18, Math.max(8, Math.floor(Math.sqrt(area) / 7)))
    const showName = width > 20 && height > 10

    return (
      <g
        style={{ cursor: githubUrl ? 'pointer' : 'default' }}
        onClick={() => githubUrl && onClick && onClick(githubUrl)}
        onMouseMove={(e) => {
          onHover?.({ name: name ?? '', lastUpdated, githubUrl, description }, e.clientX, e.clientY)
        }}
        onMouseLeave={onLeave}
      >
        <rect x={x} y={y} width={width} height={height}
          fill={cellColor} stroke="rgba(255,255,255,0.4)" strokeWidth={0.5} />
        {showName && (
          <foreignObject x={x} y={y} width={width} height={height}>
            <div style={{
              color: 'white', display: 'flex', alignItems: 'center',
              justifyContent: 'center', width: '100%', height: '100%',
              textAlign: 'center', textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
              overflow: 'hidden', padding: '2px', boxSizing: 'border-box',
            } as React.CSSProperties}>
              <span style={{ fontSize, fontWeight: 500, wordBreak: 'break-word', lineHeight: 1.1 }}>
                {name}
              </span>
            </div>
          </foreignObject>
        )}
      </g>
    )
  }

  return null
}

// ── Types ────────────────────────────────────────────────────────────────────

interface TooltipInfo {
  name: string
  lastUpdated?: string
  githubUrl?: string
  description?: string
}

interface TooltipState extends TooltipInfo {
  x: number
  y: number
}

// ── Component ────────────────────────────────────────────────────────────────

interface Props {
  modules: Module[]
  categories: Category[]
  tools: Tool[]
  searchQuery: string
  selectedModules: Set<string>
  locale: Locale
  t: Translations
}

export default function TreemapView({ modules, categories, tools, searchQuery, selectedModules, locale, t }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const filteredModules = useMemo(
    () => modules.filter(m => selectedModules.has(m.id)),
    [modules, selectedModules],
  )

  const treemapData = useMemo(() => {
    const q = searchQuery.toLowerCase()

    return filteredModules
      .slice()
      .sort((a, b) => a.order - b.order)
      .map(module => {
        const moduleCategories = categories
          .filter(c => c.moduleId === module.id)
          .sort((a, b) => a.order - b.order)

        const categoryChildren = moduleCategories
          .map(category => {
            const categoryTools: Tool[] = tools
              .filter(t => t.categoryId === category.id)
              .filter(t =>
                !q ||
                t.name.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q) ||
                t.tags.some(tag => tag.toLowerCase().includes(q)),
              )

            if (categoryTools.length === 0) return null

            return {
              name: category.name,
              moduleId: module.id,
              children: categoryTools.map(tool => ({
                name: tool.name,
                size: tool.meta?.stars || 100,
                moduleId: module.id,
                toolId: tool.id,
                lastUpdated: tool.meta?.lastCommit ?? tool.meta?.lastUpdated,
                githubUrl: tool.githubUrl,
                description: tool.description,
              })),
            }
          })
          .filter((c): c is NonNullable<typeof c> => c !== null)

        if (categoryChildren.length === 0) return null

        return {
          name: t.moduleName(module.id),
          moduleId: module.id,
          children: categoryChildren,
        }
      })
      .filter((m): m is NonNullable<typeof m> => m !== null)
  }, [filteredModules, categories, tools, searchQuery])

  if (treemapData.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-400 dark:text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">{t.noResults}</p>
          <p className="text-sm mt-1">{t.noResultsHint}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800">
      {/* Treemap */}
      <div
        className="w-full"
        style={{ height: 'calc(100vh - 150px)', minHeight: 400, background: '#1a1a2e' }}
        onMouseLeave={() => setTooltip(null)}
      >
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={treemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#fff"
            content={
              <TreemapContent
                onHover={(info, x, y) => setTooltip({ ...info, x, y })}
                onLeave={() => setTooltip(null)}
                onClick={(url) => window.open(url, '_blank')}
              />
            }
            animationDuration={300}
          />
        </ResponsiveContainer>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl p-3 w-72"
          style={{ left: tooltip.x + 14, top: tooltip.y - 14 }}
        >
          <p className="font-semibold text-sm text-gray-900 dark:text-white">{tooltip.name}</p>
          {tooltip.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{tooltip.description}</p>
          )}
          {tooltip.lastUpdated && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {t.lastCommit}: {formatRelativeTime(tooltip.lastUpdated, locale)}
            </p>
          )}
          {tooltip.githubUrl && (
            <p className="text-xs text-blue-400 mt-1">{t.clickGithub}</p>
          )}
        </div>
      )}
    </div>
  )
}
