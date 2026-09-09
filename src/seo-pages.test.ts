import { describe, expect, it } from 'vitest'
import { getSeoPage, PRERENDER_PATHS } from './seo-pages'

describe('SEO page manifest', () => {
  it('contains 49 unique canonical routes with resolvable English content', () => {
    expect(PRERENDER_PATHS).toHaveLength(49)
    expect(new Set(PRERENDER_PATHS).size).toBe(PRERENDER_PATHS.length)

    for (const routePath of PRERENDER_PATHS) {
      const page = getSeoPage(routePath, 'en')
      expect(page?.path).toBe(routePath)
      expect(page?.title).toBeTruthy()
      expect(page?.description).toBeTruthy()
      expect(page?.heading).toBeTruthy()
      expect(page?.lead).toBeTruthy()
    }
  })

  it('keeps category and tool metadata distinct from the homepage', () => {
    const home = getSeoPage('/', 'en')
    const category = getSeoPage('/tools/pdf', 'en')
    const tool = getSeoPage('/tools/pdf/merge', 'en')

    expect(category?.title).not.toBe(home?.title)
    expect(tool?.title).not.toBe(home?.title)
    expect(category?.pageType).toBe('category')
    expect(tool?.pageType).toBe('tool')
  })

  it('provides localized metadata from the same route definition', () => {
    const english = getSeoPage('/tools/pdf/merge', 'en')
    const chinese = getSeoPage('/tools/pdf/merge', 'zh')

    expect(english?.title).toContain('Merge PDFs')
    expect(chinese?.title).toContain('合并 PDF')
    expect(english?.path).toBe(chinese?.path)
  })

  it('does not resolve unknown paths as canonical pages', () => {
    expect(getSeoPage('/not-a-real-page', 'en')).toBeUndefined()
  })

  it('publishes long-tail guides as articles with related internal links', () => {
    const guide = getSeoPage('/guides/split-pdf-into-separate-pages', 'en')

    expect(guide?.pageType).toBe('article')
    expect(guide?.dateModified).toBe('2026-09-09')
    expect(guide?.title).toContain('split one PDF')
    expect(guide?.links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: '/tools/pdf/split' }),
        expect.objectContaining({ path: '/guides/merge-pdf-files' }),
      ]),
    )
  })

  it('publishes visible quality and contact pages for user trust', () => {
    const quality = getSeoPage('/how-we-test', 'en')
    const contact = getSeoPage('/contact', 'en')
    const home = getSeoPage('/', 'en')

    expect(quality?.sections).toHaveLength(4)
    expect(contact?.sections).toHaveLength(3)
    expect(home?.links).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: '/how-we-test' }),
        expect.objectContaining({ path: '/contact' }),
      ]),
    )
  })
})
