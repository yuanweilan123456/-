import { describe, expect, it } from 'vitest'
import { buildStructuredData, SITE_URL } from './seo'

describe('SEO structured data', () => {
  it('describes a tool and its visible breadcrumb hierarchy', () => {
    const canonical = `${SITE_URL}/tools/pdf/merge`
    const data = buildStructuredData(
      {
        title: 'Merge PDFs online – free & private | PixelForge',
        description: 'Merge PDF files locally.',
        pageType: 'tool',
        breadcrumbs: [
          { name: 'All tools', path: '/' },
          { name: 'PDF tools', path: '/tools/pdf' },
          { name: 'Merge PDFs', path: '/tools/pdf/merge' },
        ],
      },
      canonical,
    )

    const types = data['@graph'].map((item) => item['@type'])
    expect(types).toEqual(['WebApplication', 'BreadcrumbList', 'WebPage'])
    expect(data['@graph'][0]).toMatchObject({ url: canonical, isAccessibleForFree: true })
  })

  it('lists every supplied tool on the home page', () => {
    const data = buildStructuredData(
      {
        title: 'Free online file tools – PixelForge',
        description: 'Private browser-local file tools.',
        pageType: 'home',
        items: [
          { name: 'Merge PDFs', path: '/tools/pdf/merge' },
          { name: 'Compress images', path: '/tools/image/compress' },
        ],
      },
      `${SITE_URL}/`,
    )

    const itemList = data['@graph'].find((item) => item['@type'] === 'ItemList')
    expect(itemList).toMatchObject({ numberOfItems: 2 })
  })
})
