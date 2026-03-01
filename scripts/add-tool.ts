/**
 * add-tool.ts
 *
 * Used by the GitHub Actions workflow (add-project.yml) to add a new tool
 * from an approved Issue into the appropriate tools.json and categories/index.json.
 *
 * Usage:
 *   GITHUB_TOKEN=... tsx scripts/add-tool.ts \
 *     --github-url https://github.com/owner/repo \
 *     --module-id model-algorithm \
 *     --category-id llm \
 *     [--description "Custom description"]
 */

import { Octokit } from '@octokit/rest'
import * as fs from 'fs'
import * as path from 'path'

interface Tool {
  id: string
  name: string
  description: string
  categoryId: string
  moduleId: string
  license: string
  githubUrl: string
  koreanSupport: boolean
  tags: string[]
  meta: {
    stars: number
    forks: number
    lastUpdated: string
    lastCommit: string
    fetchedAt: string
  }
}

interface ToolsFile {
  tools: Tool[]
}

interface CategoriesFile {
  categories: Array<{ id: string; tools: string[]; [key: string]: unknown }>
}

function parseArgs(): { githubUrl: string; moduleId: string; categoryId: string; description?: string } {
  const args = process.argv.slice(2)
  const get = (flag: string) => {
    const idx = args.indexOf(flag)
    return idx !== -1 ? args[idx + 1] : undefined
  }

  const githubUrl = get('--github-url')
  const moduleId = get('--module-id')
  const categoryId = get('--category-id')

  if (!githubUrl || !moduleId || !categoryId) {
    console.error('Usage: tsx scripts/add-tool.ts --github-url <url> --module-id <id> --category-id <id> [--description <text>]')
    process.exit(1)
  }

  return { githubUrl, moduleId, categoryId, description: get('--description') }
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function main() {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.error('GITHUB_TOKEN environment variable is required')
    process.exit(1)
  }

  const { githubUrl, moduleId, categoryId, description } = parseArgs()

  // Parse GitHub URL
  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
  if (!match) {
    console.error('Invalid GitHub URL:', githubUrl)
    process.exit(1)
  }

  const [, owner, repoSlug] = match
  const repoName = repoSlug.replace(/\.git$/, '')

  const octokit = new Octokit({ auth: token })

  // Fetch repo info
  console.log(`Fetching GitHub repo: ${owner}/${repoName}...`)
  const { data: repo } = await octokit.repos.get({ owner, repo: repoName })

  const toolId = slugify(`${owner}-${repoName}`)
  const now = new Date().toISOString()

  const newTool: Tool = {
    id: toolId,
    name: repo.name,
    description: description ?? repo.description ?? '',
    categoryId,
    moduleId,
    license: repo.license?.spdx_id ?? 'Unknown',
    githubUrl: repo.html_url,
    koreanSupport: false,
    tags: repo.topics ?? [],
    meta: {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      lastUpdated: repo.updated_at ?? now,
      lastCommit: repo.pushed_at ?? now,
      fetchedAt: now,
    },
  }

  // Check for duplicates in target tools.json
  const toolsPath = path.join(process.cwd(), 'data/tools', moduleId, 'tools.json')
  if (!fs.existsSync(toolsPath)) {
    console.error(`tools.json not found for module: ${moduleId}`)
    process.exit(1)
  }

  const toolsData: ToolsFile = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'))

  const duplicate = toolsData.tools.find(
    (t) => t.githubUrl === repo.html_url || t.id === toolId,
  )
  if (duplicate) {
    console.error(`Tool already exists: ${duplicate.name} (${duplicate.id})`)
    process.exit(1)
  }

  // Add tool to tools.json
  toolsData.tools.push(newTool)
  fs.writeFileSync(toolsPath, JSON.stringify(toolsData, null, 2) + '\n')
  console.log(`✓ Added to data/tools/${moduleId}/tools.json`)

  // Add tool id to categories/index.json
  const categoriesPath = path.join(process.cwd(), 'data/categories/index.json')
  const categoriesData: CategoriesFile = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'))

  const category = categoriesData.categories.find((c) => c.id === categoryId)
  if (!category) {
    console.error(`Category not found: ${categoryId}`)
    process.exit(1)
  }

  if (!category.tools.includes(toolId)) {
    category.tools.push(toolId)
    fs.writeFileSync(categoriesPath, JSON.stringify(categoriesData, null, 2) + '\n')
    console.log(`✓ Added to data/categories/index.json (category: ${categoryId})`)
  }

  console.log(`\nSuccess! Added: ${newTool.name} (${toolId})`)
  console.log(`  Stars: ${repo.stargazers_count.toLocaleString()}`)
  console.log(`  License: ${newTool.license}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
