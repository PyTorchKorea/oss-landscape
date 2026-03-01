import type { Tool, Module, Category } from '../types'

// Static imports for all data files
import modulesData from '../../data/modules/index.json'
import categoriesData from '../../data/categories/index.json'

// Import all tool files via Vite glob (eager = synchronous at build time)
const toolFiles = import.meta.glob('/data/tools/*/tools.json', { eager: true }) as Record<
  string,
  { tools: Tool[] }
>

export function getModules(): Module[] {
  return (modulesData as { modules: Module[] }).modules
}

export function getCategories(): Category[] {
  return (categoriesData as { categories: Category[] }).categories
}

export function getTools(): Tool[] {
  return Object.values(toolFiles).flatMap((file) => file.tools ?? [])
}
