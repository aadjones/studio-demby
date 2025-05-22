const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const { Feed } = require('feed')

const projectsDirectory = path.join(process.cwd(), 'content/projects')

async function buildFeed() {
  const siteUrl = 'https://www.studiodemby.com'
  const feed = new Feed({
    title: 'Studio Demby • New drops',
    description: "Fresh audiovisual rituals and generative art.",
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    favicon: `${siteUrl}/favicon.ico`,
    updated: new Date(),
    generator: 'feed (npm)',
    copyright: '© 2025 Studio Demby. All rights reserved.'
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

    // Skip if no cluster
    if (!data.cluster) continue

    // Construct image URL if image exists in frontmatter
    const imageUrl = data.image ? `${siteUrl}${data.image}` : null

    feed.addItem({
      title: data.title,
      id: `${siteUrl}/${data.cluster}/${slug}`,
      link: `${siteUrl}/${data.cluster}/${slug}`,
      description: data.summary || '',
      content: imageUrl ? 
        `<p><img src="${imageUrl}" alt="${data.title}" /></p><p>${data.summary || ''}</p>` :
        `<p>${data.summary || ''}</p>`,
      date: new Date(data.date),
      ...(imageUrl && {
        image: imageUrl,
        enclosure: {
          url: imageUrl,
          type: imageUrl.endsWith('.png') ? 'image/png' : 
                imageUrl.endsWith('.webp') ? 'image/webp' : 
                (imageUrl.endsWith('.jpg') || imageUrl.endsWith('.jpeg')) ? 'image/jpeg' : 
                'image/jpeg' // fallback to jpeg
        }
      })
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