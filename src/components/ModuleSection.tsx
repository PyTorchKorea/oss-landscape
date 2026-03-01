import ToolCard from './ToolCard'
import type { ModuleWithCategories } from '../types'
import type { Translations } from '../i18n/translations'

const MODULE_COLORS: Record<string, { bg: string; border: string; header: string }> = {
  'infra-computing':    { bg: '#E3F2FD', border: '#2196F3', header: '#1565C0' },
  'data-storage':       { bg: '#E8F5E9', border: '#4CAF50', header: '#2E7D32' },
  'model-algorithm':    { bg: '#FFEBEE', border: '#F44336', header: '#C62828' },
  'training-inference': { bg: '#FFF3E0', border: '#FF9800', header: '#E65100' },
  'platform-mlops':     { bg: '#F3E5F5', border: '#9C27B0', header: '#6A1B9A' },
  'application-service':{ bg: '#E1F5FE', border: '#03A9F4', header: '#0277BD' },
  'security-governance':{ bg: '#FCE4EC', border: '#E91E63', header: '#AD1457' },
}

interface ModuleSectionProps {
  module: ModuleWithCategories
  dimmed: boolean
  t: Translations
}

export default function ModuleSection({ module, dimmed, t }: ModuleSectionProps) {
  const colors = MODULE_COLORS[module.id] ?? { bg: '#F5F5F5', border: '#9E9E9E', header: '#424242' }
  const colCount = Math.min(module.categoryItems.length, 4)

  return (
    <div
      className="rounded-lg overflow-hidden border-2 transition-all duration-300"
      style={{
        borderColor: colors.border,
        opacity: dimmed ? 0.35 : 1,
        filter: dimmed ? 'saturate(0.3)' : 'none',
        transform: dimmed ? 'scale(0.98)' : 'scale(1)',
      }}
    >
      {/* Module header */}
      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{ backgroundColor: colors.header }}
      >
        <span className="text-white font-semibold text-sm">{t.moduleName(module.id)}</span>
        <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
          {t.items(module.toolCount)}
        </span>
      </div>

      {/* Categories grid */}
      <div
        className="p-3 grid gap-3"
        style={{
          backgroundColor: colors.bg,
          gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
        }}
      >
        {module.categoryItems.map((category) => (
          <div key={category.id}>
            <p
              className="text-xs font-semibold text-gray-500 mb-1.5 pb-1 border-b"
              style={{ borderColor: colors.border }}
            >
              {t.categoryName(category.id, category.name)}
              <span className="font-normal ml-1">({category.toolItems.length})</span>
            </p>
            <div className="flex flex-wrap gap-1">
              {category.toolItems.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
