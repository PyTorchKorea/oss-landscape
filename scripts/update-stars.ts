import { Octokit } from '@octokit/rest'
import * as fs from 'fs'
import * as path from 'path'

const TOOLS_DIR = path.join(process.cwd(), 'data/tools')

interface ToolMeta {
  stars: number
  forks?: number
  lastUpdated: string
  lastCommit?: string
  fetchedAt: string
}

interface Tool {
  id: string
  name: string
  githubUrl?: string
  meta: ToolMeta
  [key: string]: unknown
}

interface ToolsFile {
  tools: Tool[]
}

async function main() {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.error('GITHUB_TOKEN environment variable is required')
    process.exit(1)
  }

  const octokit = new Octokit({ auth: token })

  const moduleDirs = fs.readdirSync(TOOLS_DIR).filter((dir) =>
    fs.statSync(path.join(TOOLS_DIR, dir)).isDirectory(),
  )

  let totalUpdated = 0
  let totalFailed = 0

  for (const moduleDir of moduleDirs) {
    const toolsPath = path.join(TOOLS_DIR, moduleDir, 'tools.json')
    if (!fs.existsSync(toolsPath)) continue

    const data: ToolsFile = JSON.parse(fs.readFileSync(toolsPath, 'utf-8'))
    let modified = false

    for (const tool of data.tools) {
      if (!tool.githubUrl) continue

      const match = tool.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
      if (!match) continue

      const [, owner, repo] = match
      const repoName = repo.replace(/\.git$/, '')

      try {
        const { data: repoData } = await octokit.repos.get({ owner, repo: repoName })
        const now = new Date().toISOString()

        tool.meta = {
          ...tool.meta,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          lastUpdated: repoData.updated_at ?? now,
          lastCommit: repoData.pushed_at ?? now,
          fetchedAt: now,
        }

        console.log(`✓ ${tool.name}: ${repoData.stargazers_count.toLocaleString()} stars`)
        totalUpdated++
        modified = true
      } catch (error) {
        console.error(`✗ ${tool.name}: ${(error as Error).message}`)
        totalFailed++
      }

      // Rate limit: 100ms between requests
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    if (modified) {
      fs.writeFileSync(toolsPath, JSON.stringify(data, null, 2) + '\n')
    }
  }

  console.log(`\nDone! Updated: ${totalUpdated}, Failed: ${totalFailed}`)
}

main().catch(console.error)
