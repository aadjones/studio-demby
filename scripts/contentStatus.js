#!/usr/bin/env node
/**
 * Prints what is live on the site and what isn't.
 *
 * Reads frontmatter straight from content/, so it can never go stale the way a
 * checked-in status table would. Run it before assuming a project is published.
 *
 *   pnpm content:status
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const DIRS = [
  { label: 'project', dir: path.join(process.cwd(), 'content/projects') },
  { label: 'activity', dir: path.join(process.cwd(), 'content/activity') },
]

const GROUPS = [
  { status: 'published', heading: 'LIVE', note: 'listed, in sitemap, indexed' },
  { status: 'draft', heading: 'DRAFT', note: 'not listed, not in sitemap, noindex' },
  { status: 'archived', heading: 'ARCHIVED', note: 'not listed, but URL stays indexed' },
]

const items = []
const problems = []

for (const { label, dir } of DIRS) {
  if (!fs.existsSync(dir)) continue

  for (const fileName of fs.readdirSync(dir).sort()) {
    if (!fileName.endsWith('.mdx')) continue

    const slug = fileName.replace(/\.mdx$/, '')
    const { data } = matter(fs.readFileSync(path.join(dir, fileName), 'utf8'))
    const status = data.status ?? 'published'

    if (!GROUPS.some((g) => g.status === status)) {
      problems.push(`${slug} has unknown status "${status}"`)
      continue
    }
    items.push({ slug, status, kind: label })
  }
}

for (const { status, heading, note } of GROUPS) {
  const group = items.filter((i) => i.status === status)
  console.log(`\n${heading} (${group.length}) — ${note}`)
  if (group.length === 0) {
    console.log('  (none)')
    continue
  }
  for (const { slug, kind } of group) {
    console.log(`  ${slug}${kind === 'activity' ? '  [activity]' : ''}`)
  }
}

console.log(`\n${items.length} items total.`)

if (problems.length > 0) {
  console.log('\nPROBLEMS')
  for (const p of problems) console.log(`  ${p}`)
  process.exit(1)
}
