import { guides } from './guide-content'
import { categoryCopy, categoryOrder, getToolByPath, tools } from './features/tools/catalog'
import { categoryPageContent, getToolPageContent } from './features/tools/content'
import type { ToolCategory } from './features/tools/types'
import type { SeoContent, SeoLink } from './seo'

export type SeoLanguage = 'en' | 'zh'

export type SeoSection = {
  heading: string
  paragraphs?: string[]
  items?: string[]
}

export type SeoPageDefinition = SeoContent & {
  path: string
  heading: string
  lead: string
  links?: SeoLink[]
  sections?: SeoSection[]
}

type LocalizedStaticPage = {
  path: string
  pageType?: SeoContent['pageType']
  en: Omit<SeoPageDefinition, 'path' | 'pageType'>
  zh: Omit<SeoPageDefinition, 'path' | 'pageType'>
}

const staticPages: LocalizedStaticPage[] = [
  {
    path: '/',
    pageType: 'home',
    en: {
      title: 'Free File Tools – PDF, Images, DOCX & More – PixelForge',
      description:
        'Use 24 free online tools for images, PDF, Word, PowerPoint, ZIP, JSON, and CSV. Process files locally with no uploads or sign-up.',
      heading: 'Free online file tools, private by design.',
      lead: 'Convert, compress, and organize PDFs, images, Word, PowerPoint, ZIP, and data files right in your browser. No uploads. No account.',
    },
    zh: {
      title: '免费在线文件工具｜PDF、图片、Word 与更多｜PixelForge',
      description:
        '24 个免费在线文件工具，支持图片、PDF、Word、PPT、ZIP、JSON 和 CSV。浏览器本地处理，无需上传或注册。',
      heading: '免费的在线文件工具，私密完成每个任务。',
      lead: '直接在浏览器中处理 PDF、图片、Word、PPT、ZIP 和数据文件。无需上传，无需注册。',
    },
  },
  {
    path: '/tools/image/studio',
    pageType: 'tool',
    en: {
      title: 'Image tools – PixelForge',
      description: 'Compress, convert, and resize images locally in your browser with no sign-up or uploads.',
      heading: 'Private image processing in your browser',
      lead: 'Compress, convert, resize, rotate, and flip JPG, PNG, and WebP images without uploading them.',
    },
    zh: {
      title: '图片处理工具｜PixelForge',
      description: '在浏览器本地压缩、转换和调整图片，无需注册，不上传图片。',
      heading: '在浏览器本地处理图片',
      lead: '无需上传即可压缩、转换、调整、旋转和翻转 JPG、PNG 与 WebP 图片。',
    },
  },
  {
    path: '/guides',
    pageType: 'page',
    en: {
      title: 'File processing guides – PixelForge',
      description: 'Practical steps, format limits, and privacy advice for common image, PDF, Word, and PPT tasks.',
      heading: 'Understand the task, then choose the tool',
      lead: 'Practical guides for common file tasks, browser limitations, and private local processing.',
    },
    zh: {
      title: '文件处理指南｜PixelForge',
      description: '了解图片、PDF、Word 和 PPT 常见任务的处理步骤、格式限制和隐私建议。',
      heading: '先理解方法，再选择工具',
      lead: '了解常见文件任务、浏览器限制和本地处理方式。',
    },
  },
  {
    path: '/faq',
    pageType: 'page',
    en: {
      title: 'FAQ – PixelForge',
      description:
        'Learn how PixelForge local processing works, what files are supported, and which browser limits apply.',
      heading: 'Common questions, answered clearly',
      lead: 'Learn how local processing works, what browsers support, and when to use each tool.',
      sections: [
        {
          heading: 'Private browser-local processing',
          paragraphs: [
            'PixelForge processes selected files in your current browser session. Files are not uploaded to a PixelForge server.',
            'Performance depends on your device memory, browser, and the number or size of files you process at once.',
          ],
        },
      ],
    },
    zh: {
      title: '常见问题｜PixelForge',
      description: '了解 PixelForge 的本地处理方式、文件支持范围和浏览器限制。',
      heading: '开始之前，先解决常见问题',
      lead: '了解文件处理方式、浏览器限制和各工具的适用范围。',
      sections: [
        {
          heading: '浏览器本地处理',
          paragraphs: [
            'PixelForge 在当前浏览器会话中处理所选文件，文件不会上传到 PixelForge 服务器。',
            '处理性能取决于设备内存、浏览器以及同时处理的文件数量和大小。',
          ],
        },
      ],
    },
  },
  {
    path: '/about',
    pageType: 'page',
    en: {
      title: 'About PixelForge | Local file toolbox',
      description: 'Learn how PixelForge uses browser-local processing to provide lightweight, private file tools.',
      heading: 'A small, dependable local file toolbox',
      lead: 'PixelForge focuses on useful everyday file tasks with clear steps and browser-local processing.',
    },
    zh: {
      title: '关于 PixelForge｜本地文件工具箱',
      description: '了解 PixelForge 如何用浏览器本地能力提供轻量、私密的文件处理工具。',
      heading: '小而可靠的本地文件工具箱',
      lead: 'PixelForge 专注于高频文件任务、清晰步骤和浏览器本地处理。',
    },
  },
  {
    path: '/privacy',
    pageType: 'page',
    en: {
      title: 'Privacy policy – PixelForge',
      description: 'Learn how PixelForge handles files, privacy preferences, and Google AdSense advertising.',
      heading: 'Privacy policy',
      lead: 'PixelForge is designed to process files on your device and does not upload or store user file contents.',
    },
    zh: {
      title: '隐私政策｜PixelForge',
      description: '了解 PixelForge 如何处理文件、隐私偏好和 Google AdSense 广告服务。',
      heading: '隐私政策',
      lead: 'PixelForge 旨在让文件留在你的设备上处理，不上传或保存用户文件内容。',
    },
  },
  {
    path: '/terms',
    pageType: 'page',
    en: {
      title: 'Terms of use – PixelForge',
      description: 'Usage scope, responsibility boundaries, and browser compatibility for PixelForge file tools.',
      heading: 'Terms of use',
      lead: 'Only process files that you have the right to use. Results and compatibility may vary by file and device.',
    },
    zh: {
      title: '使用条款｜PixelForge',
      description: 'PixelForge 文件工具的使用范围、责任边界和浏览器兼容性说明。',
      heading: '使用条款',
      lead: '请仅处理你有权使用的文件。处理结果和浏览器兼容性可能因文件和设备而异。',
    },
  },
]

function normalizePath(path: string) {
  const pathname = path.split(/[?#]/, 1)[0] || '/'
  return pathname !== '/' ? pathname.replace(/\/+$/, '') : '/'
}

function categoryBreadcrumbs(category: ToolCategory, language: SeoLanguage): SeoLink[] {
  return [
    { name: language === 'zh' ? '全部工具' : 'All tools', path: '/' },
    { name: categoryCopy[category].title[language], path: `/tools/${category}` },
  ]
}

export function getSeoPage(path: string, language: SeoLanguage = 'en'): SeoPageDefinition | undefined {
  const pathname = normalizePath(path)
  const tool = getToolByPath(pathname)
  if (tool) {
    const content = getToolPageContent(tool, language)
    const breadcrumbs = [
      ...categoryBreadcrumbs(tool.category, language),
      { name: tool.title[language], path: tool.path },
    ]
    return {
      path: tool.path,
      title: content.seoTitle,
      description: content.seoDescription,
      heading: tool.title[language],
      lead: tool.description[language],
      pageType: 'tool',
      breadcrumbs,
      links: tools
        .filter((item) => item.category === tool.category && item.id !== tool.id)
        .slice(0, 4)
        .map((item) => ({ name: item.title[language], path: item.path })),
      sections: [
        { heading: language === 'zh' ? '使用方法' : 'How it works', items: content.steps },
        { heading: content.whyTitle, paragraphs: [content.whyText] },
      ],
    }
  }

  const category = categoryOrder.find((item) => pathname === `/tools/${item}`)
  if (category) {
    const content = categoryPageContent[category]
    const localized = content[language]
    const categoryTools = tools.filter((item) => item.category === category)
    return {
      path: pathname,
      title: content.seoTitle[language],
      description: content.seoDescription[language],
      heading: localized.heading,
      lead: localized.lead,
      pageType: 'category',
      breadcrumbs: categoryBreadcrumbs(category, language),
      items: categoryTools.map((item) => ({ name: item.title[language], path: item.path })),
      links: categoryTools.map((item) => ({ name: item.title[language], path: item.path })),
      sections: [
        { heading: localized.overviewTitle, paragraphs: [localized.overview] },
        { heading: localized.useCasesTitle, items: localized.useCases },
        ...localized.faq.map((item) => ({ heading: item.question, paragraphs: [item.answer] })),
      ],
    }
  }

  if (pathname.startsWith('/guides/')) {
    const guide = guides.find((item) => pathname === `/guides/${item.slug}`)
    if (!guide) return undefined
    const content = guide[language]
    return {
      path: pathname,
      title: `${content.title} | PixelForge`,
      description: content.description,
      heading: content.title,
      lead: content.intro,
      pageType: 'article',
      breadcrumbs: [
        { name: language === 'zh' ? '全部工具' : 'All tools', path: '/' },
        { name: language === 'zh' ? '使用指南' : 'Guides', path: '/guides' },
        { name: content.title, path: pathname },
      ],
      links: [
        { name: content.toolLabel, path: guide.toolPath },
        ...guides
          .filter((item) => item.category === guide.category && item.slug !== guide.slug)
          .slice(0, 3)
          .map((item) => ({ name: item[language].title, path: `/guides/${item.slug}` })),
      ],
      sections: [
        { heading: language === 'zh' ? '操作步骤' : 'Steps', items: content.steps },
        ...content.sections.map((section) => ({ heading: section.heading, paragraphs: section.paragraphs })),
      ],
    }
  }

  const staticPage = staticPages.find((item) => item.path === pathname)
  if (!staticPage) return undefined
  const localized = staticPage[language]
  const page: SeoPageDefinition = {
    ...localized,
    path: staticPage.path,
    pageType: staticPage.pageType,
  }

  if (pathname === '/') {
    page.items = tools.map((item) => ({ name: item.title[language], path: item.path }))
    page.links = categoryOrder.map((item) => ({
      name: categoryCopy[item].title[language],
      path: `/tools/${item}`,
    }))
  } else if (pathname === '/tools/image/studio') {
    page.breadcrumbs = [
      { name: language === 'zh' ? '全部工具' : 'All tools', path: '/' },
      { name: language === 'zh' ? '图片工作台' : 'Image studio', path: pathname },
    ]
    page.links = tools
      .filter((item) => item.category === 'image')
      .map((item) => ({ name: item.title[language], path: item.path }))
  } else if (pathname === '/guides') {
    page.links = guides.map((guide) => ({ name: guide[language].title, path: `/guides/${guide.slug}` }))
  }

  return page
}

export const PRERENDER_PATHS = [
  ...staticPages.map((page) => page.path),
  ...categoryOrder.map((category) => `/tools/${category}`),
  ...tools.map((tool) => tool.path),
  ...guides.map((guide) => `/guides/${guide.slug}`),
]
