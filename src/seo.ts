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

export function updateSeo(content: SeoContent) {
  document.title = content.title
  setMeta('description', content.description)
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
}
