export type SeoContent = {
  title: string
  description: string
}

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

function setStructuredData(data: Record<string, unknown>) {
  let element = document.head.querySelector<HTMLScriptElement>('#pixelforge-structured-data')
  if (!element) {
    element = document.createElement('script')
    element.id = 'pixelforge-structured-data'
    element.type = 'application/ld+json'
    document.head.appendChild(element)
  }
  element.textContent = JSON.stringify(data)
}

export function updateSeo(content: SeoContent) {
  document.title = content.title
  setMeta('description', content.description)
  setMeta('robots', 'index,follow')
  setProperty('og:title', content.title)
  setProperty('og:description', content.description)
  setProperty('og:type', 'website')

  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.rel = 'canonical'
    document.head.appendChild(canonical)
  }
  const url = new URL(window.location.href)
  url.hash = ''
  url.search = ''
  canonical.href = url.toString()
  setProperty('og:url', canonical.href)

  const isGuide = window.location.pathname.startsWith('/guides/')
  setStructuredData(
    isGuide
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: content.title,
          description: content.description,
          url: canonical.href,
          author: { '@type': 'Organization', name: 'PixelForge' },
          publisher: { '@type': 'Organization', name: 'PixelForge' },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'PixelForge File Toolbox',
          description: content.description,
          url: canonical.href,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
  )
}
