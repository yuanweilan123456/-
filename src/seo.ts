export type SeoPageType = 'home' | 'category' | 'tool' | 'article' | 'page'

export type SeoLink = {
  name: string
  path: string
}

export type SeoContent = {
  title: string
  description: string
  pageType?: SeoPageType
  breadcrumbs?: SeoLink[]
  items?: SeoLink[]
  index?: boolean
  dateModified?: string
}

export const SITE_URL = 'https://file-tools.xyz'

function setMeta(name: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.name = name
    document.head.appendChild(element)
  }
  element.content = content
}

function setProperty(property: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }
  element.content = content
}

function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

export function buildStructuredData(content: SeoContent, canonical: string, language = 'en') {
  const graph: Array<Record<string, unknown>> = []
  const webPage: Record<string, unknown> = {
    '@type':
      content.pageType === 'category' ? 'CollectionPage' : content.pageType === 'article' ? 'Article' : 'WebPage',
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: content.title,
    description: content.description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    inLanguage: language,
  }
  if (content.pageType === 'article') {
    webPage.headline = content.title.replace(/\s*[|｜].*$/, '')
    webPage.author = { '@type': 'Organization', name: 'FileTools', url: `${SITE_URL}/how-we-test` }
    webPage.publisher = {
      '@type': 'Organization',
      name: 'FileTools',
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/favicon.svg`,
    }
    if (content.dateModified) webPage.dateModified = content.dateModified
  }

  if (content.pageType === 'home') {
    graph.push({
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: 'FileTools',
      alternateName: 'Private browser file tools',
      image: `${SITE_URL}/favicon.svg`,
      description: content.description,
      inLanguage: ['en', 'zh-CN'],
    })
  }

  if (content.pageType === 'tool') {
    graph.push({
      '@type': 'WebApplication',
      '@id': `${canonical}#tool`,
      name: content.title.replace(/\s*(?:[|｜]|–\s*free).*$/, ''),
      description: content.description,
      url: canonical,
      applicationCategory: 'UtilitiesApplication',
      browserRequirements: 'Requires a modern web browser with JavaScript enabled',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    })
  }

  if (content.items?.length) {
    graph.push({
      '@type': 'ItemList',
      '@id': `${canonical}#tools`,
      numberOfItems: content.items.length,
      itemListElement: content.items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    })
  }

  if (content.breadcrumbs && content.breadcrumbs.length >= 2) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': `${canonical}#breadcrumb`,
      itemListElement: content.breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    })
  }

  graph.push(webPage)
  return { '@context': 'https://schema.org', '@graph': graph }
}

function setStructuredData(data: ReturnType<typeof buildStructuredData>) {
  let element = document.head.querySelector<HTMLScriptElement>('#filetools-structured-data')
  if (!element) {
    element = document.createElement('script')
    element.id = 'filetools-structured-data'
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }
  element.textContent = JSON.stringify(data)
}

export function updateSeo(content: SeoContent) {
  const canonical = absoluteUrl(window.location.pathname)
  const locale = document.documentElement.lang === 'zh-CN' ? 'zh_CN' : 'en_US'

  document.title = content.title
  setMeta('description', content.description)
  setMeta('robots', content.index === false ? 'noindex,follow' : 'index,follow,max-image-preview:large')
  setMeta('twitter:card', 'summary')
  setMeta('twitter:title', content.title)
  setMeta('twitter:description', content.description)
  setProperty('og:title', content.title)
  setProperty('og:description', content.description)
  setProperty('og:type', content.pageType === 'article' ? 'article' : 'website')
  setProperty('og:site_name', 'FileTools')
  setProperty('og:locale', locale)
  setProperty('og:url', canonical)

  let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonicalLink) {
    canonicalLink = document.createElement('link')
    canonicalLink.rel = 'canonical'
    document.head.appendChild(canonicalLink)
  }
  canonicalLink.href = canonical

  setStructuredData(buildStructuredData(content, canonical, document.documentElement.lang || 'en'))
}
