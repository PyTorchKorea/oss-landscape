export interface ToolMeta {
  stars: number
  forks?: number
  lastUpdated: string
  lastCommit?: string
  fetchedAt: string
}

export interface Tool {
  id: string
  name: string
  description: string
  categoryId: string
  moduleId: string
  license: string
  licenseUrl?: string
  githubUrl?: string
  docsUrl?: string
  websiteUrl?: string
  koreanSupport: boolean
  tags: string[]
  meta: ToolMeta
}

export interface Module {
  id: string
  name: string
  description: string
  icon: string
  order: number
  color: string
  categories: string[]
}

export interface Category {
  id: string
  moduleId: string
  name: string
  description: string
  order: number
  tools: string[]
}

export interface CategoryWithTools extends Category {
  toolItems: Tool[]
}

export interface ModuleWithCategories extends Module {
  categoryItems: CategoryWithTools[]
  toolCount: number
}
