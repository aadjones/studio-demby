// scripts/generateRss.ts
import fs from 'fs'
import { Feed } from 'feed'
import { getAllProjects } from "@/lib/content/projects-loader";

async function buildFeed() {
  const siteUrl = 'https://studiodemy.com'
  const feed = new Feed({
    title: 'Studio Demy • New drops',
    id:   siteUrl,
    link: siteUrl,
    language: 'en',
    favicon: `${siteUrl}/favicon.ico`,
    copyright: 'Aaron Demby Jones',
  })

  // Assuming getAllProjects() returns an array of { title, slug, date, summary }
  const projects = await getAllProjects()

  projects.forEach(p => {
    if (!p.date) return; // Skip projects without a date
    
    const url = `${siteUrl}/${p.slug}`
    feed.addItem({
      title:       p.title,
      id:          url,
      link:        url,
      description: p.summary || '',
      date:        new Date(p.date), // Now TypeScript knows p.date is a string
    })
  })

  // Ensure public/ exists
  fs.mkdirSync('./public', { recursive: true })
  fs.writeFileSync('./public/feed.xml',  feed.rss2())
  fs.writeFileSync('./public/atom.xml', feed.atom1())
}

buildFeed().catch(err => {
  console.error(err)
  process.exit(1)
})
