#!/usr/bin/env node
/**
 * Before/after safety net for site-wide changes.
 *
 *   pnpm snapshot capture <base-url> <name>   screenshot every page at 375 and 1440
 *   pnpm snapshot diff <before> <after> [noise]   list pages that changed or newly broke
 *
 * Pages come from the repo, not the sitemap: every static page.tsx plus every
 * content file of any status, so drafts and archived pages are covered too.
 * Snapshots land in snapshots/<name>/ (gitignored).
 *
 * Canvases, videos and iframes are hidden before the screenshot so animated
 * sketches don't register as changes. Check those pages by hand.
 */

const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const { chromium } = require('playwright')

const ROOT = process.cwd()
const OUT = path.join(ROOT, 'snapshots')
const WIDTHS = [375, 1440]
const CONCURRENCY = 3

function routes() {
  const pages = fs
    .readdirSync(path.join(ROOT, 'app'), { recursive: true })
    .filter((f) => f.endsWith('page.tsx') && !f.includes('['))
    .map((f) => '/' + path.dirname(f).replace(/^\.$/, ''))

  const content = fs
    .readdirSync(path.join(ROOT, 'content/projects'))
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => `/work/${f.replace(/\.mdx$/, '')}`)

  return [...new Set([...pages, ...content])].sort()
}

const fileFor = (route, width) =>
  `${route === '/' ? 'home' : route.slice(1).replace(/\//g, '__')}-${width}.png`

async function shoot(browser, base, route, width, dir) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' })
  const broken = []
  const errors = []
  // Vercel's analytics scripts only exist on Vercel, so they 404 on localhost; not a breakage.
  const vercelOnly = (url) => url.includes('/_vercel/')
  page.on('response', (res) => {
    if (res.status() >= 400 && !vercelOnly(res.url())) broken.push(`${res.status()} ${res.url()}`)
  })
  page.on('requestfailed', (req) => {
    // Media requests get aborted routinely when a page moves on; not a breakage.
    if (!req.failure()?.errorText.includes('ERR_ABORTED')) broken.push(`failed ${req.url()}`)
  })
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error' && !vercelOnly(m.location().url ?? '')) errors.push(m.text())
  })

  let status = 0
  try {
    const res = await page.goto(base + route, { waitUntil: 'load', timeout: 60000 })
    status = res?.status() ?? 0
    await page.addStyleTag({ content: 'canvas,video,iframe{visibility:hidden!important}' })
    // Scroll through so lazy images load, then wait for them.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 100))
      }
      window.scrollTo(0, 0)
    })
    await page
      .waitForFunction(() => [...document.images].every((img) => img.complete), null, { timeout: 20000 })
      .catch(() => errors.push('capture: images still loading after 20s'))
    // Fonts use display: swap, so an early screenshot can catch the fallback face.
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: path.join(dir, fileFor(route, width)), fullPage: true, animations: 'disabled' })
  } catch (e) {
    errors.push(`capture: ${e.message.split('\n')[0]}`)
  }
  await page.close()
  return { route, width, status, broken: [...new Set(broken)], errors }
}

async function capture(base, name) {
  const dir = path.join(OUT, name)
  fs.mkdirSync(dir, { recursive: true })
  base = base.replace(/\/$/, '')

  const jobs = routes().flatMap((route) => WIDTHS.map((width) => ({ route, width })))
  const browser = await chromium.launch()
  const report = []
  let next = 0
  const worker = async () => {
    while (next < jobs.length) {
      const { route, width } = jobs[next++]
      report.push(await shoot(browser, base, route, width, dir))
      process.stdout.write(`\r${report.length}/${jobs.length}`)
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))
  await browser.close()

  report.sort((a, b) => a.route.localeCompare(b.route) || a.width - b.width)
  fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(report, null, 2))

  const bad = report.filter((r) => r.status >= 400 || r.broken.length || r.errors.length)
  console.log(`\n${report.length} captures in snapshots/${name}/, ${bad.length} with problems:`)
  for (const r of bad) {
    console.log(`  ${r.route} @${r.width}  status ${r.status}`)
    for (const line of [...r.broken, ...r.errors]) console.log(`    ${line.slice(0, 160)}`)
  }
}

/** Percent of pixels that differ between two screenshots, or a note when the page height changed. */
function pixelDiff(a, b) {
  const size = (f) => execFileSync('magick', ['identify', '-format', '%wx%h', f]).toString()
  const [sa, sb] = [size(a), size(b)]
  if (sa !== sb) return `height ${sa.split('x')[1]} → ${sb.split('x')[1]}`
  const out = execFileSync('magick', [
    a, b, '-compose', 'difference', '-composite', '-colorspace', 'gray', '-threshold', '8%',
    '-format', '%[fx:mean*100]', 'info:',
  ])
  return parseFloat(out.toString())
}

function diff(before, after, noise) {
  const load = (name) => {
    const file = path.join(OUT, name, 'report.json')
    if (!fs.existsSync(file)) throw new Error(`No snapshot named "${name}" (looked for ${file})`)
    return new Map(JSON.parse(fs.readFileSync(file, 'utf8')).map((r) => [`${r.route} @${r.width}`, r]))
  }
  const A = load(before)
  const B = load(after)
  // Pages that also differ between two captures of the same site are listed separately.
  const N = noise ? load(noise) : new Map()
  const changed = []
  const noisy = []
  const problems = []
  let same = 0

  for (const key of [...new Set([...A.keys(), ...B.keys()])].sort()) {
    const a = A.get(key)
    const b = B.get(key)
    if (!a || !b) {
      problems.push(`${key}: only in ${a ? before : after}`)
      continue
    }
    if (a.status !== b.status) problems.push(`${key}: status ${a.status} → ${b.status}`)
    // Compare by path so a localhost or preview capture matches production URLs.
    const pathOf = (line) => line.replace(/https?:\/\/[^/]+/, '')
    const brokenBefore = a.broken.map(pathOf)
    for (const line of b.broken.filter((x) => !brokenBefore.includes(pathOf(x)))) problems.push(`${key}: new broken ${line}`)
    for (const line of b.errors.filter((x) => !a.errors.includes(x))) problems.push(`${key}: new error ${line.slice(0, 140)}`)

    const pa = path.join(OUT, before, fileFor(a.route, a.width))
    const pb = path.join(OUT, after, fileFor(b.route, b.width))
    if (!fs.existsSync(pa) || !fs.existsSync(pb)) continue
    const d = pixelDiff(pa, pb)
    if (d === 0) {
      same++
      continue
    }
    const line = `${key}: ${typeof d === 'number' ? `${d.toFixed(2)}% of pixels` : d}`
    const n = N.get(key)
    const pn = n && path.join(OUT, noise, fileFor(n.route, n.width))
    if (pn && fs.existsSync(pn) && pixelDiff(pa, pn) !== 0) noisy.push(line)
    else changed.push(line)
  }

  console.log(`\nNEW PROBLEMS (${problems.length})`)
  problems.forEach((p) => console.log(`  ${p}`))
  console.log(`\nVISUALLY CHANGED (${changed.length})`)
  changed.forEach((c) => console.log(`  ${c}`))
  if (noise) {
    console.log(`\nCHANGED, BUT ALSO CHANGES BETWEEN IDENTICAL RUNS (${noisy.length})`)
    noisy.forEach((c) => console.log(`  ${c}`))
  }
  console.log(`\nUNCHANGED: ${same}`)
}

const [cmd, x, y, z] = process.argv.slice(2)
if (cmd === 'capture' && x && y) capture(x, y)
else if (cmd === 'diff' && x && y) diff(x, y, z)
else {
  console.log(
    'Usage:\n  pnpm snapshot capture <base-url> <name>\n  pnpm snapshot diff <before> <after> [noise]\n\n' +
      '[noise] is a second capture of the "before" site; pages that differ between the two are listed separately.'
  )
  process.exit(1)
}
