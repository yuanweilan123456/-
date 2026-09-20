import { execFileSync } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildStructuredData, SITE_URL } from '../src/seo.ts'
import { getSeoPage, PRERENDER_PATHS, type SeoPageDefinition } from '../src/seo-pages.ts'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_DIR = path.resolve(SCRIPT_DIR, '..')
const DIST_DIR = path.join(PROJECT_DIR, 'dist')
const INDEX_FILE = path.join(DIST_DIR, 'index.html')

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function canonicalUrl(routePath: string) {
  return new URL(routePath, SITE_URL).toString()
}

function replaceRequired(html: string, pattern: RegExp, replacement: string, label: string) {
  if (!pattern.test(html)) throw new Error(`Unable to find ${label} in the Vite HTML output.`)
  return html.replace(pattern, replacement)
}

function replaceMeta(html: string, attribute: 'name' | 'property', key: string, content: string) {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`<meta\\s+[^>]*${attribute}=["']${escapedKey}["'][^>]*>`, 'i')
  return replaceRequired(
    html,
    pattern,
    `<meta ${attribute}="${escapeHtml(key)}" content="${escapeHtml(content)}" />`,
    `${attribute}=${key}`,
  )
}

function renderLinks(links: SeoPageDefinition['links']) {
  if (!links?.length) return ''
  return `<section aria-labelledby="related-links-title"><h2 id="related-links-title">Explore related pages</h2><ul>${links
    .map((link) => `<li><a href="${escapeHtml(link.path)}">${escapeHtml(link.name)}</a></li>`)
    .join('')}</ul></section>`
}

function renderBreadcrumbs(page: SeoPageDefinition) {
  if (!page.breadcrumbs?.length) return ''
  return `<nav aria-label="Breadcrumb"><ol>${page.breadcrumbs
    .map((item) => `<li><a href="${escapeHtml(item.path)}">${escapeHtml(item.name)}</a></li>`)
    .join('')}</ol></nav>`
}

function renderSections(page: SeoPageDefinition) {
  return (page.sections ?? [])
    .map((section) => {
      const paragraphs = (section.paragraphs ?? []).map((text) => `<p>${escapeHtml(text)}</p>`).join('')
      const items = section.items?.length
        ? `<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        : ''
      return `<section><h2>${escapeHtml(section.heading)}</h2>${paragraphs}${items}</section>`
    })
    .join('')
}

function renderStaticShell(page: SeoPageDefinition) {
  return `<div id="app"><div class="prerender-shell" data-prerendered-route="${escapeHtml(page.path)}">
    <header><a class="prerender-brand" href="/">FileTools</a><nav aria-label="Main navigation"><a href="/">All tools</a><a href="/guides">Guides</a><a href="/faq">FAQ</a><a href="/about">About</a><a href="/how-we-test">How we test</a><a href="/contact">Contact</a></nav></header>
    <main>${renderBreadcrumbs(page)}<h1>${escapeHtml(page.heading)}</h1><p class="prerender-lead">${escapeHtml(page.lead)}</p>${renderSections(page)}${renderLinks(page.links)}</main>
    <footer><a href="/about">About</a><a href="/how-we-test">How we test</a><a href="/contact">Contact</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><p>Free browser-local file tools from FileTools.</p></footer>
  </div></div>`
}

const PRERENDER_STYLE = `<style id="filetools-prerender-style">
  .prerender-shell{max-width:1120px;margin:auto;padding:0 24px;color:#172033;font:16px/1.65 Inter,ui-sans-serif,system-ui,sans-serif}
  .prerender-shell header,.prerender-shell footer{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:24px 0}
  .prerender-shell nav,.prerender-shell footer{display:flex;flex-wrap:wrap;gap:16px}.prerender-brand{font-size:1.25rem;font-weight:800}
  .prerender-shell a{color:#3157d5;text-decoration:none}.prerender-shell main{padding:56px 0}.prerender-shell h1{max-width:820px;font-size:clamp(2.2rem,6vw,4.5rem);line-height:1.05;letter-spacing:-.04em}
  .prerender-lead{max-width:760px;font-size:1.2rem}.prerender-shell section{max-width:820px;margin-top:40px}.prerender-shell li{margin:8px 0}
  @media(max-width:640px){.prerender-shell header{align-items:flex-start;flex-direction:column}.prerender-shell main{padding:32px 0}}
</style>`

function renderPage(baseHtml: string, page: SeoPageDefinition) {
  const canonical = canonicalUrl(page.path)
  const structuredData = JSON.stringify(buildStructuredData(page, canonical, 'en')).replaceAll('<', '\\u003c')
  let html = baseHtml

  html = replaceRequired(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`, 'title')
  html = replaceMeta(html, 'name', 'description', page.description)
  html = replaceMeta(html, 'name', 'robots', 'index,follow,max-image-preview:large')
  html = replaceMeta(html, 'name', 'twitter:title', page.title)
  html = replaceMeta(html, 'name', 'twitter:description', page.description)
  html = replaceMeta(html, 'property', 'og:title', page.title)
  html = replaceMeta(html, 'property', 'og:description', page.description)
  html = replaceMeta(html, 'property', 'og:url', canonical)
  html = replaceMeta(html, 'property', 'og:type', page.pageType === 'article' ? 'article' : 'website')
  html = replaceRequired(
    html,
    /<link\s+[^>]*rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    'canonical link',
  )
  html = replaceRequired(
    html,
    /<script\s+[^>]*id=["']filetools-structured-data["'][^>]*>[\s\S]*?<\/script>/i,
    `<script id="filetools-structured-data" type="application/ld+json">${structuredData}</script>`,
    'structured data',
  )
  html = replaceRequired(html, /<\/head>/i, `${PRERENDER_STYLE}</head>`, 'closing head tag')
  html = replaceRequired(html, /<div\s+id=["']app["']>\s*<\/div>/i, renderStaticShell(page), 'app mount point')
  html = replaceRequired(html, /<noscript>[\s\S]*?<\/noscript>/i, '', 'fallback noscript content')
  return html
}

function lastModifiedDate() {
  try {
    const value = execFileSync('git', ['log', '-1', '--format=%cI'], {
      cwd: PROJECT_DIR,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    return new Date(value).toISOString().slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

function renderSitemap(pages: SeoPageDefinition[]) {
  const lastmod = lastModifiedDate()
  const entries = pages
    .map(
      (page) =>
        `  <url>\n    <loc>${escapeHtml(canonicalUrl(page.path))}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`,
    )
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

async function main() {
  const baseHtml = await readFile(INDEX_FILE, 'utf8')
  const pages = PRERENDER_PATHS.map((routePath) => getSeoPage(routePath, 'en'))
  if (pages.some((page) => !page)) throw new Error('The SEO manifest contains an unresolved route.')
  const resolvedPages = pages as SeoPageDefinition[]

  for (const page of resolvedPages) {
    const outputFile = page.path === '/' ? INDEX_FILE : path.join(DIST_DIR, `${page.path.replace(/^\//, '')}.html`)
    await mkdir(path.dirname(outputFile), { recursive: true })
    await writeFile(outputFile, renderPage(baseHtml, page), 'utf8')
  }

  await writeFile(path.join(DIST_DIR, 'sitemap.xml'), renderSitemap(resolvedPages), 'utf8')
  console.log(`Prerendered ${resolvedPages.length} canonical routes and refreshed sitemap.xml.`)
}

await main()
