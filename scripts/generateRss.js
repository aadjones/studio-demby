const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const { Feed } = require('feed')

const projectsDirectory = path.join(process.cwd(), 'content/projects')

async function buildFeed() {
  const siteUrl = 'https://www.studiodemby.com'
  const feed = new Feed({
    title: 'Studio Demy • New drops',
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    favicon: `${siteUrl}/favicon.ico`,
    updated: new Date(),
    generator: 'feed (npm)',
    copyright: '© 2025 Studio Demy. All rights reserved.'
  })

  // Iterate all MDX files
  const fileNames = fs.readdirSync(projectsDirectory)
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.mdx')) continue

    const slug = fileName.replace(/\.mdx$/, '')
    const fullPath = path.join(projectsDirectory, fileName)
    const raw = fs.readFileSync(fullPath, 'utf8')
    const { data } = matter(raw)

    // Skip if no date
    if (!data.date) continue

    feed.addItem({
      title: data.title,
      id: `${siteUrl}/projects/${slug}`,
      link: `${siteUrl}/projects/${slug}`,
      description: data.summary || '',
      date: new Date(data.date)
    })
  }

  // Write feeds
  fs.mkdirSync('public', { recursive: true })
  fs.writeFileSync('public/feed.xml', feed.rss2())
  fs.writeFileSync('public/atom.xml', feed.atom1())

  console.log('✅ feed.xml & atom.xml generated in public/')
}

buildFeed().catch(err => {
  console.error(err)
  process.exit(1)
}) 