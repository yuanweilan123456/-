import { describe, expect, it } from 'vitest'
import { buildStructuredData, SITE_URL } from './seo'

describe('SEO structured data', () => {
  it('describes a tool and its visible breadcrumb hierarchy', () => {
    const canonical = `${SITE_URL}/tools/pdf/merge`
    const data = buildStructuredData(
      {
        title: 'Merge PDFs online – free & private | FileTools',
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
        title: 'Free online file tools – FileTools',
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

  it('includes the reviewed date on guide article data', () => {
    const canonical = `${SITE_URL}/guides/merge-pdf-files`
    const data = buildStructuredData(
      {
        title: 'How to merge PDF files | FileTools',
        description: 'A practical PDF merging guide.',
        pageType: 'article',
        dateModified: '2026-09-09',
      },
      canonical,
    )

    const article = data['@graph'].find((item) => item['@type'] === 'Article')
    expect(article).toMatchObject({ dateModified: '2026-09-09' })
  })
})
