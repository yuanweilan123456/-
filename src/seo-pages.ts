import { guides } from './guide-content'
import { getGuideDetails } from './guide-details'
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
      title: 'Free File Tools – PDF, Images, DOCX & More – FileTools',
      description: `Use ${tools.length} free online tools for images, PDF, Word, PowerPoint, ZIP, JSON, and CSV. Process files locally with no uploads or sign-up.`,
      heading: 'Free online file tools, private by design.',
      lead: 'Convert, compress, and organize PDFs, images, Word, PowerPoint, ZIP, and data files right in your browser. No uploads. No account.',
      sections: [
        {
          heading: 'Choose the right tool for the file',
          paragraphs: [
            'Start with the outcome you need. Merge several PDFs into one file, split a long PDF into selected pages, or reorder pages before sharing. For images, compress a photo before sending it, resize it for a form, or convert between JPG, PNG, and WebP. Document, presentation, archive, and data tools have separate pages so you can check the supported input before selecting a file.',
          ],
          items: [
            'Working with pages? Browse PDF tools and check whether the PDF is text-based, scanned, or encrypted.',
            'Preparing an image? Choose a target size or format, then compare the exported file with the original.',
            'Handling office files? Keep a copy of the source because complex fonts, tables, and page layouts may change.',
          ],
        },
        {
          heading: 'What browser-local processing means',
          paragraphs: [
            'The current tools read the files you select in your browser and create results on your device. File contents are not uploaded to a FileTools conversion server, and you do not need an account to begin. This is useful for everyday private tasks, but it does not remove the need to review a result before sending it elsewhere. Available memory and browser support can limit very large or damaged files.',
          ],
        },
        {
          heading: 'Check the result before using it',
          paragraphs: [
            'Open the downloaded file and inspect the pages, text, images, and file size. Browser conversion can change complex Word or PowerPoint formatting; PDF-to-Word may need manual cleanup, especially for scans or multi-column layouts. If you only need a faithful visual copy, a page-image workflow may be more suitable than editable text. Each tool page explains its specific input, output, and known limitations.',
          ],
        },
      ],
    },
    zh: {
      title: '免费在线文件工具｜PDF、图片、Word 与更多｜FileTools',
      description: `${tools.length} 个免费在线文件工具，支持图片、PDF、Word、PPT、ZIP、JSON 和 CSV。浏览器本地处理，无需上传或注册。`,
      heading: '免费的在线文件工具，私密完成每个任务。',
      lead: '直接在浏览器中处理 PDF、图片、Word、PPT、ZIP 和数据文件。无需上传，无需注册。',
      sections: [
        {
          heading: '先根据文件和目标选择工具',
          paragraphs: [
            '需要合并、拆分或重新排序页面时，选择 PDF 工具；需要发送更小的照片时，选择图片压缩；表单限制尺寸时，使用图片缩放。文档、演示文稿、压缩包与数据文件也有单独的工具页，可以先看清支持的输入格式和输出结果。',
          ],
          items: [
            '处理 PDF 时，先确认文件是普通文本、扫描件还是加密文件。',
            '处理图片时，设定目标尺寸或格式，并与原图比较质量和体积。',
            '处理 Office 文件时保留原件，复杂字体、表格和分页可能变化。',
          ],
        },
        {
          heading: '浏览器本地处理意味着什么',
          paragraphs: [
            '当前工具在浏览器里读取所选文件，并在你的设备上生成结果。文件内容不会上传到 FileTools 的转换服务器，也无需注册账号。设备内存、浏览器支持和损坏的源文件仍可能限制处理效果。',
          ],
        },
        {
          heading: '使用前检查下载结果',
          paragraphs: [
            '请打开输出文件，检查页码、文字、图片方向和文件体积。复杂 Word 或 PPT 排版以及 PDF 转 Word 可能需要人工修正，扫描件和多栏排版尤其如此。如果只需保持视觉外观，按页导出图片可能比可编辑文字更合适。各工具页面都会说明具体限制。',
          ],
        },
      ],
    },
  },
  {
    path: '/tools/image/studio',
    pageType: 'tool',
    en: {
      title: 'Image tools – FileTools',
      description: 'Compress, convert, and resize images locally in your browser with no sign-up or uploads.',
      heading: 'Private image processing in your browser',
      lead: 'Compress, convert, resize, rotate, and flip JPG, PNG, and WebP images without uploading them.',
    },
    zh: {
      title: '图片处理工具｜FileTools',
      description: '在浏览器本地压缩、转换和调整图片，无需注册，不上传图片。',
      heading: '在浏览器本地处理图片',
      lead: '无需上传即可压缩、转换、调整、旋转和翻转 JPG、PNG 与 WebP 图片。',
    },
  },
  {
    path: '/guides',
    pageType: 'page',
    en: {
      title: 'File processing guides – FileTools',
      description: 'Practical steps, format limits, and privacy advice for common image, PDF, Word, and PPT tasks.',
      heading: 'Understand the task, then choose the tool',
      lead: 'Practical guides for common file tasks, browser limitations, and private local processing.',
    },
    zh: {
      title: '文件处理指南｜FileTools',
      description: '了解图片、PDF、Word 和 PPT 常见任务的处理步骤、格式限制和隐私建议。',
      heading: '先理解方法，再选择工具',
      lead: '了解常见文件任务、浏览器限制和本地处理方式。',
    },
  },
  {
    path: '/faq',
    pageType: 'page',
    en: {
      title: 'FAQ – FileTools',
      description:
        'Learn how FileTools local processing works, what files are supported, and which browser limits apply.',
      heading: 'Common questions, answered clearly',
      lead: 'Learn how local processing works, what browsers support, and when to use each tool.',
      sections: [
        {
          heading: 'Are my files uploaded to a server?',
          paragraphs: [
            'No. Current tools read and process files in your browser and do not send them to a FileTools server.',
          ],
        },
        {
          heading: 'Which file types are supported?',
          paragraphs: [
            'Tools cover JPG, PNG, WebP, PDF, DOCX, PPTX, ZIP, CSV, JSON, Base64, and file checksums. Each tool page lists exact input limits.',
          ],
        },
        {
          heading: 'Why can complex Word layouts change?',
          paragraphs: [
            'DOCX to HTML prioritizes headings, paragraphs, lists, tables, and images. Exact pagination, floating objects, headers, and fonts may change.',
          ],
        },
        {
          heading: 'Can I use FileTools on a phone?',
          paragraphs: [
            'Yes, but large files depend on device memory, browser capabilities, and available battery. A current browser is recommended.',
          ],
        },
        {
          heading: 'Will a result always match the source perfectly?',
          paragraphs: [
            'Not always. Interactive PDFs and complex office layouts need careful review. Keep the original and open every downloaded result.',
          ],
        },
        {
          heading: 'How are the tools tested?',
          paragraphs: [
            'Releases run type checks, code-quality rules, unit tests, production builds, crawlable-page verification, and real-browser interface checks.',
          ],
        },
        {
          heading: 'How should I report a problem?',
          paragraphs: [
            'Provide the tool, browser version, reproducible steps, and expected and actual results without publicly attaching private source files.',
          ],
        },
      ],
      links: [
        { name: 'How we test', path: '/how-we-test' },
        { name: 'Contact and feedback', path: '/contact' },
      ],
    },
    zh: {
      title: '常见问题｜FileTools',
      description: '了解 FileTools 的本地处理方式、文件支持范围和浏览器限制。',
      heading: '开始之前，先解决常见问题',
      lead: '了解文件处理方式、浏览器限制和各工具的适用范围。',
      sections: [
        {
          heading: '我的文件会上传到服务器吗？',
          paragraphs: ['不会。当前工具在浏览器中读取和处理文件，不会发送到 FileTools 服务器。'],
        },
        {
          heading: '支持哪些文件类型？',
          paragraphs: [
            '工具覆盖 JPG、PNG、WebP、PDF、DOCX、PPTX、ZIP、CSV、JSON、Base64 和文件校验值；具体输入限制以工具页为准。',
          ],
        },
        {
          heading: '为什么复杂 Word 排版可能变化？',
          paragraphs: [
            'DOCX 转 HTML 优先保留标题、段落、列表、表格和图片，精确分页、浮动对象、页眉页脚和字体可能变化。',
          ],
        },
        {
          heading: '手机上可以使用吗？',
          paragraphs: ['可以，但大文件处理取决于设备内存、浏览器能力和电量，建议使用最新版浏览器。'],
        },
        {
          heading: '处理结果一定和原文件完全一致吗？',
          paragraphs: ['不一定。交互式 PDF 和复杂办公排版需要仔细复核，请保留原文件并打开每个下载结果。'],
        },
        {
          heading: '工具如何测试？',
          paragraphs: ['每次发布会执行类型检查、代码规范、单元测试、生产构建、可抓取页面校验和真实浏览器界面检查。'],
        },
        {
          heading: '如何报告问题？',
          paragraphs: ['请提供工具、浏览器版本、复现步骤、预期和实际结果，不要在公开反馈中上传私密源文件。'],
        },
      ],
      links: [
        { name: '质量与测试', path: '/how-we-test' },
        { name: '联系与反馈', path: '/contact' },
      ],
    },
  },
  {
    path: '/how-we-test',
    pageType: 'page',
    en: {
      title: 'How FileTools builds and tests browser file tools',
      description:
        'Read how FileTools verifies browser-local file processing, tests common failures, documents limitations, and checks every release.',
      heading: 'How we build and test file tools',
      lead: 'A transparent explanation of local processing, automated checks, browser testing, known limits, and result review.',
      links: [
        { name: 'Read practical guides', path: '/guides' },
        { name: 'Contact and feedback', path: '/contact' },
      ],
      sections: [
        {
          heading: 'Start with a real task, then test it',
          paragraphs: [
            'Each tool is built around one clear job and describes its expected input, output, and browser limits.',
            'Project-generated fixtures cover the main workflow as well as empty files, invalid formats, incorrect page ranges, and other recoverable errors.',
          ],
        },
        {
          heading: 'Where processing happens',
          paragraphs: [
            'The current tools use browser capabilities and front-end libraries. Selected files are not sent to a FileTools server.',
            'Local processing depends on device memory and browser support, so damaged, encrypted, or unusually large files may not work.',
          ],
        },
        {
          heading: 'Release quality gates',
          paragraphs: [
            'Changes pass type checking, code-quality rules, unit tests, production builds, and checks for titles, headings, canonical links, and sitemap entries.',
            'Important interfaces are reviewed in a real browser on desktop and mobile, in both light and dark themes.',
          ],
        },
        {
          heading: 'Review every result',
          paragraphs: [
            'Open the downloaded result and check page order, text, image orientation, special characters, and filenames before relying on it.',
          ],
        },
      ],
    },
    zh: {
      title: 'FileTools 如何构建和测试浏览器文件工具',
      description: '了解 FileTools 如何验证浏览器本地文件处理、测试常见失败、记录限制并检查每次发布。',
      heading: '我们如何构建和测试文件工具',
      lead: '公开说明本地处理、自动化检查、浏览器测试、已知限制和结果复核方法。',
      links: [
        { name: '阅读使用指南', path: '/guides' },
        { name: '联系与反馈', path: '/contact' },
      ],
      sections: [
        {
          heading: '先验证实际任务，再发布工具',
          paragraphs: [
            '每个工具都围绕一个明确任务设计，并说明预期输入、输出和浏览器限制。',
            '项目生成的测试文件会覆盖正常流程，也包括空文件、错误格式、无效页码和其他可恢复错误。',
          ],
        },
        {
          heading: '文件处理发生在哪里',
          paragraphs: [
            '当前工具使用浏览器能力和前端库处理，所选文件不会发送到 FileTools 服务器。',
            '本地处理取决于设备内存和浏览器支持，损坏、加密或异常大的文件可能无法处理。',
          ],
        },
        {
          heading: '发布质量门禁',
          paragraphs: [
            '每次修改都会经过类型检查、代码规范、单元测试、生产构建，以及页面标题、主标题、规范链接和站点地图检查。',
            '重要界面还会在桌面和移动浏览器、深色和浅色模式中分别检查。',
          ],
        },
        {
          heading: '复核每一个结果',
          paragraphs: ['正式使用前，请打开下载结果并检查页码、文字、图片方向、特殊字符和文件名。'],
        },
      ],
    },
  },
  {
    path: '/contact',
    pageType: 'page',
    en: {
      title: 'Contact FileTools | Bug reports and feedback',
      description:
        'Report a FileTools tool problem, suggest a browser-local feature, or send privacy and content feedback through public GitHub Issues.',
      heading: 'Make a problem visible, reproducible, and fixable',
      lead: 'FileTools accepts bug reports, feature requests, and website feedback through public GitHub Issues.',
      links: [
        { name: 'Privacy policy', path: '/privacy' },
        { name: 'How we test', path: '/how-we-test' },
        { name: 'Open GitHub Issues', path: 'https://github.com/yuanweilan123456/-/issues' },
      ],
      sections: [
        {
          heading: 'Report a tool problem',
          paragraphs: [
            'Include the tool name, browser and version, steps, expected result, and actual result. Never attach a private source file publicly.',
          ],
        },
        {
          heading: 'Request a feature',
          paragraphs: [
            'Describe the task, common input formats, desired output, and why an existing tool does not solve it.',
          ],
        },
        {
          heading: 'Protect your information',
          paragraphs: [
            'Remove names, account details, and file contents from screenshots or examples before creating a public issue.',
            'The project repository at github.com/yuanweilan123456/- provides a public record of changes and issue reports. GitHub is a third-party service with its own privacy terms.',
          ],
        },
      ],
    },
    zh: {
      title: '联系 FileTools｜错误报告与建议',
      description: '通过公开 GitHub Issues 报告 FileTools 工具问题、建议浏览器本地功能，或反馈隐私和内容问题。',
      heading: '让问题可以被看见、复现和修复',
      lead: 'FileTools 通过公开 GitHub Issues 接收错误报告、功能建议和网站反馈。',
      links: [
        { name: '隐私政策', path: '/privacy' },
        { name: '质量与测试', path: '/how-we-test' },
        { name: '打开 GitHub Issues', path: 'https://github.com/yuanweilan123456/-/issues' },
      ],
      sections: [
        {
          heading: '报告工具错误',
          paragraphs: ['请写明工具名称、浏览器及版本、操作步骤、预期结果和实际结果，不要公开上传真实私密文件。'],
        },
        {
          heading: '提出功能建议',
          paragraphs: ['请描述要完成的任务、常见输入格式、希望得到的输出，以及现有工具为什么不能满足需求。'],
        },
        {
          heading: '保护你的信息',
          paragraphs: [
            '创建公开问题前，请删除截图和示例中的姓名、账号及文件内容。',
            '项目仓库 github.com/yuanweilan123456/- 提供公开的更新和问题记录。GitHub 是第三方服务，有自己的隐私条款。',
          ],
        },
      ],
    },
  },
  {
    path: '/privacy',
    pageType: 'page',
    en: {
      title: 'Privacy policy – FileTools',
      description: 'Learn how FileTools handles files, privacy preferences, and Google AdSense advertising.',
      heading: 'Privacy policy',
      lead: 'FileTools is designed to process files on your device and does not upload or store user file contents.',
      links: [
        { name: 'Contact and feedback', path: '/contact' },
        { name: 'Google Ads Settings', path: 'https://adssettings.google.com/' },
        {
          name: 'How Google uses information from partner sites',
          path: 'https://policies.google.com/technologies/partner-sites',
        },
      ],
      sections: [
        {
          heading: 'File processing',
          paragraphs: [
            'Images, PDFs, DOCX, and PPTX files are processed in the browser. FileTools does not upload file contents or create cloud copies.',
          ],
        },
        {
          heading: 'Local preferences',
          paragraphs: [
            'Theme and language preferences are stored on the device and can be cleared through browser settings. FileTools currently has no user accounts.',
          ],
        },
        {
          heading: 'Google advertising cookies',
          paragraphs: [
            'Third-party vendors, including Google, use cookies to serve ads based on a user’s prior visits to this website or other websites. Google advertising cookies enable Google and its partners to serve ads based on visits to sites on the Internet.',
            'Users can visit Google Ads Settings to opt out of personalized advertising. FileTools does not send selected file contents to Google.',
          ],
        },
        {
          heading: 'Retention and policy changes',
          paragraphs: [
            'FileTools does not retain source files or processed results on a server. Material policy changes will be documented on this page.',
          ],
        },
      ],
    },
    zh: {
      title: '隐私政策｜FileTools',
      description: '了解 FileTools 如何处理文件、隐私偏好和 Google AdSense 广告服务。',
      heading: '隐私政策',
      lead: 'FileTools 旨在让文件留在你的设备上处理，不上传或保存用户文件内容。',
      links: [
        { name: '联系与反馈', path: '/contact' },
        { name: 'Google 广告设置', path: 'https://adssettings.google.com/' },
        { name: 'Google 如何使用合作伙伴网站信息', path: 'https://policies.google.com/technologies/partner-sites' },
      ],
      sections: [
        {
          heading: '文件处理',
          paragraphs: ['图片、PDF、DOCX 和 PPTX 文件在浏览器中处理，FileTools 不上传文件内容，也不创建云端副本。'],
        },
        {
          heading: '本地偏好',
          paragraphs: ['主题和语言偏好保存在设备上，可以通过浏览器设置清除。FileTools 当前不提供用户账号。'],
        },
        {
          heading: 'Google 广告 Cookie',
          paragraphs: [
            '包括 Google 在内的第三方供应商会使用 Cookie，根据用户此前访问本网站或其他网站的情况投放广告。Google 广告 Cookie 使 Google 及其合作伙伴能够根据用户对互联网站点的访问投放广告。',
            '用户可以访问 Google 广告设置退出个性化广告。FileTools 不会把所选文件内容发送给 Google。',
          ],
        },
        {
          heading: '保留与政策变更',
          paragraphs: ['FileTools 不在服务器保留源文件或处理结果。若政策发生实质变化，会在本页记录。'],
        },
      ],
    },
  },
  {
    path: '/terms',
    pageType: 'page',
    en: {
      title: 'Terms of use – FileTools',
      description: 'Usage scope, responsibility boundaries, and browser compatibility for FileTools.',
      heading: 'Terms of use',
      lead: 'Only process files that you have the right to use. Results and compatibility may vary by file and device.',
      links: [{ name: 'Contact and feedback', path: '/contact' }],
      sections: [
        {
          heading: 'Permitted use',
          paragraphs: [
            'Only process files you have the right to use and follow applicable laws and third-party rights.',
          ],
        },
        {
          heading: 'Tool limitations',
          paragraphs: [
            'Results vary with file structure, browser capability, device memory, and file size. Open every result before deleting an original or relying on the output.',
          ],
        },
        {
          heading: 'Prohibited behavior',
          paragraphs: [
            'Do not use the service for illegal, infringing, fraudulent, malware-related, or harmful content.',
          ],
        },
      ],
    },
    zh: {
      title: '使用条款｜FileTools',
      description: 'FileTools 文件工具的使用范围、责任边界和浏览器兼容性说明。',
      heading: '使用条款',
      lead: '请仅处理你有权使用的文件。处理结果和浏览器兼容性可能因文件和设备而异。',
      links: [{ name: '联系与反馈', path: '/contact' }],
      sections: [
        { heading: '允许的使用', paragraphs: ['请只处理你有权使用的文件，并遵守适用法律和第三方权利。'] },
        {
          heading: '工具限制',
          paragraphs: [
            '结果可能因文件结构、浏览器能力、设备内存和文件大小而不同。删除原文件或依赖结果前应先打开检查。',
          ],
        },
        { heading: '禁止行为', paragraphs: ['不得将服务用于违法、侵权、欺诈、恶意软件或危害他人的内容。'] },
      ],
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
        {
          heading: language === 'zh' ? '适合哪些任务' : 'Best suited for',
          paragraphs: [content.editorial.bestFor],
        },
        {
          heading: language === 'zh' ? '输入与输出' : 'Input and output',
          paragraphs: [
            `${language === 'zh' ? '输入：' : 'Input: '}${content.editorial.input}`,
            `${language === 'zh' ? '输出：' : 'Output: '}${content.editorial.output}`,
          ],
        },
        {
          heading: language === 'zh' ? '已知限制' : 'Known limitation',
          paragraphs: [content.editorial.limitation],
        },
        {
          heading: language === 'zh' ? '实用建议' : 'Practical tips',
          items: content.editorial.tips,
        },
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
    const details = getGuideDetails(guide.slug)
    const localizedDetails = details?.[language]
    return {
      path: pathname,
      title: `${content.title} | FileTools`,
      description: content.description,
      heading: content.title,
      lead: content.intro,
      pageType: 'article',
      dateModified: details?.reviewed,
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
        ...(localizedDetails
          ? [
              {
                heading: language === 'zh' ? '处理概览' : 'At a glance',
                paragraphs: [
                  `${language === 'zh' ? '适合' : 'Best for'}: ${localizedDetails.bestFor}`,
                  `${language === 'zh' ? '输入' : 'Input'}: ${localizedDetails.input}`,
                  `${language === 'zh' ? '输出' : 'Output'}: ${localizedDetails.output}`,
                ],
              },
              {
                heading: language === 'zh' ? '下载前检查' : 'Before downloading',
                items: localizedDetails.checklist,
              },
              ...localizedDetails.questions.map((item) => ({
                heading: item.question,
                paragraphs: [item.answer],
              })),
            ]
          : []),
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
    page.links = [
      ...categoryOrder.map((item) => ({
        name: categoryCopy[item].title[language],
        path: `/tools/${item}`,
      })),
      { name: language === 'zh' ? '实用使用指南' : 'Practical guides', path: '/guides' },
      { name: language === 'zh' ? '质量与测试' : 'Quality and testing', path: '/how-we-test' },
      { name: language === 'zh' ? '联系与反馈' : 'Contact and feedback', path: '/contact' },
    ]
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
