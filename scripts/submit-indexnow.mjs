import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HOST = 'file-tools.xyz'
const KEY = 'ab5d67d6c559e2ce8b88442d013d6880'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const PROJECT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

async function waitForKeyLocation() {
  for (let attempt = 1; attempt <= 7; attempt += 1) {
    try {
      const response = await fetch(KEY_LOCATION, { signal: AbortSignal.timeout(10_000) })
      if (response.ok && (await response.text()).trim() === KEY) return
    } catch {
      // A deployment can still be propagating. Retry below.
    }
    if (attempt < 7) await new Promise((resolve) => setTimeout(resolve, 10_000))
  }
  throw new Error(`IndexNow key is not available at ${KEY_LOCATION}`)
}

const sitemap = await readFile(path.join(PROJECT_DIR, 'public', 'sitemap.xml'), 'utf8')
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1])
if (!urlList.length) throw new Error('No URLs were found in public/sitemap.xml')

await waitForKeyLocation()
const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
  signal: AbortSignal.timeout(20_000),
})

if (!response.ok) {
  throw new Error(`IndexNow submission failed with HTTP ${response.status}: ${await response.text()}`)
}

console.log(`Submitted ${urlList.length} canonical URLs to IndexNow (HTTP ${response.status}).`)
