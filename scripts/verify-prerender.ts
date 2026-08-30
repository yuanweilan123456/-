import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL } from '../src/seo.ts'
import { getSeoPage, PRERENDER_PATHS } from '../src/seo-pages.ts'

const PROJECT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST_DIR = path.join(PROJECT_DIR, 'dist')

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

for (const routePath of PRERENDER_PATHS) {
  const page = getSeoPage(routePath, 'en')
  if (!page) throw new Error(`Missing SEO definition for ${routePath}`)
  const outputFile =
    routePath === '/' ? path.join(DIST_DIR, 'index.html') : path.join(DIST_DIR, `${routePath.replace(/^\//, '')}.html`)
  const html = await readFile(outputFile, 'utf8')
  const canonical = new URL(routePath, SITE_URL).toString()

  if (!html.includes(`<title>${escapeHtml(page.title)}</title>`)) throw new Error(`Incorrect title for ${routePath}`)
  if (!new RegExp(`<link rel="canonical" href="${escapeRegExp(canonical)}"`).test(html)) {
    throw new Error(`Incorrect canonical for ${routePath}`)
  }
  if (!html.includes(`data-prerendered-route="${routePath}"`)) throw new Error(`Missing static shell for ${routePath}`)
  if (!html.includes(`<h1>${escapeHtml(page.heading)}</h1>`)) throw new Error(`Missing static H1 for ${routePath}`)
  if (html.includes('<noscript>')) throw new Error(`Duplicate noscript fallback remains for ${routePath}`)
}

const sitemap = await readFile(path.join(DIST_DIR, 'sitemap.xml'), 'utf8')
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
if (sitemapUrls.length !== PRERENDER_PATHS.length) {
  throw new Error(`Expected ${PRERENDER_PATHS.length} sitemap URLs, found ${sitemapUrls.length}`)
}
if (!sitemap.includes('<lastmod>')) throw new Error('Sitemap is missing lastmod freshness signals')

console.log(`Verified ${PRERENDER_PATHS.length} prerendered pages, canonical tags, H1 content, and sitemap URLs.`)
