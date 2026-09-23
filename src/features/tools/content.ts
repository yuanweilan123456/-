import type { LocalizedText, ToolCategory, ToolDefinition } from './types'
import { getToolEditorial, toolEditorial } from './editorial'

type CategoryLocaleContent = {
  heading: string
  lead: string
  overviewTitle: string
  overview: string
  useCasesTitle: string
  useCases: string[]
  faq: Array<{ question: string; answer: string }>
}

export type CategoryPageContent = {
  seoTitle: LocalizedText
  seoDescription: LocalizedText
  en: CategoryLocaleContent
  zh: CategoryLocaleContent
}

export const categoryPageContent: Record<ToolCategory, CategoryPageContent> = {
  image: {
    seoTitle: {
      en: 'Free online image tools – private & local | FileTools',
      zh: '免费在线图片工具｜本地处理｜FileTools',
    },
    seoDescription: {
      en: 'Compress, convert, resize, rotate, and flip JPG, PNG, and WebP images free in your browser. No uploads or sign-up.',
      zh: '免费压缩、转换、调整、旋转和翻转 JPG、PNG、WebP 图片。浏览器本地处理，无需上传或注册。',
    },
    en: {
      heading: 'Free online image tools that keep files on your device',
      lead: 'Compress, convert, resize, rotate, and flip JPG, PNG, and WebP images without waiting for an upload.',
      overviewTitle: 'Finish everyday image tasks in one private workspace',
      overview:
        'FileTools uses browser image APIs to process files on your device. Choose a focused tool for a quick task or open the image studio when you need format, quality, size, rotation, and flip controls together.',
      useCasesTitle: 'Useful for websites, forms, and everyday sharing',
      useCases: [
        'Reduce photos before adding them to a website or email.',
        'Convert an image to a format accepted by an upload form.',
        'Resize or rotate screenshots before sharing them.',
      ],
      faq: [
        {
          question: 'Which image formats are supported?',
          answer: 'The image tools support JPG, PNG, and WebP in current desktop and mobile browsers.',
        },
        {
          question: 'Are my images uploaded?',
          answer:
            'No. Image processing runs in your browser and selected files are cleared when you leave or refresh the page.',
        },
      ],
    },
    zh: {
      heading: '文件留在设备上的免费在线图片工具',
      lead: '无需等待上传，即可压缩、转换、调整、旋转和翻转 JPG、PNG 与 WebP 图片。',
      overviewTitle: '在一个私密工作台完成日常图片任务',
      overview:
        'FileTools 使用浏览器图片能力在设备上处理文件。简单任务可以直接打开对应工具，需要同时调整格式、质量、尺寸和方向时可使用图片工作台。',
      useCasesTitle: '适合网站、表单和日常分享',
      useCases: [
        '在上传网站或发送邮件前减小照片体积。',
        '将图片转换为表单支持的格式。',
        '分享截图前调整尺寸或旋转方向。',
      ],
      faq: [
        { question: '支持哪些图片格式？', answer: '当前桌面和移动浏览器支持 JPG、PNG 和 WebP。' },
        { question: '图片会上传吗？', answer: '不会。图片在浏览器中处理，离开或刷新页面后，已选择的文件会被清除。' },
      ],
    },
  },
  pdf: {
    seoTitle: {
      en: 'Free PDF tools – Word to PDF, PDF to Word & more | FileTools',
      zh: '免费 PDF 工具｜Word 与 PDF 互转、合并与拆分｜FileTools',
    },
    seoDescription: {
      en: 'Convert Word to PDF, export PDF to Word, JPG or text, and merge, split or organize pages. Free local processing with no uploads.',
      zh: 'Word 转 PDF、PDF 转 Word、图片和文本，以及合并、拆分和整理页面。免费本地处理，不上传文件。',
    },
    en: {
      heading: 'Organize PDF files online without uploading them',
      lead: 'Convert Word and PDF, export page images or text, merge documents, split pages, and organize files locally.',
      overviewTitle: 'Practical PDF tools for real document workflows',
      overview:
        'Choose only the operation you need and download a fresh PDF when it is ready. Processing happens in browser memory, making these tools a good fit for routine forms, scans, notes, and attachments.',
      useCasesTitle: 'Common PDF jobs made simpler',
      useCases: [
        'Combine contracts or course materials in reading order.',
        'Extract only the pages needed for a submission.',
        'Turn phone scans or photos into one portable PDF.',
      ],
      faq: [
        {
          question: 'Can FileTools open password-protected PDFs?',
          answer:
            'Encrypted or damaged PDFs may not be readable. Save an unlocked copy in a trusted PDF reader before using the tool.',
        },
        {
          question: 'Why can a very large PDF be slow?',
          answer:
            'Local processing uses your device memory, so large scans or hundreds of pages may take longer. Smaller batches are more reliable.',
        },
      ],
    },
    zh: {
      heading: '无需上传即可在线整理 PDF 文件',
      lead: 'Word 与 PDF 互转，导出页面图片和文字，以及本地合并文档、拆分和整理页面。',
      overviewTitle: '面向真实文档流程的实用 PDF 工具',
      overview:
        '只选择当前需要的操作，处理完成后下载新的 PDF。整个过程在浏览器内存中完成，适合处理表单、扫描件、笔记和附件。',
      useCasesTitle: '让常见 PDF 任务更简单',
      useCases: ['按阅读顺序合并合同或课程资料。', '只提取提交材料需要的页面。', '将手机扫描件或照片整理为一个 PDF。'],
      faq: [
        {
          question: '可以处理带密码的 PDF 吗？',
          answer: '加密或损坏的 PDF 可能无法读取，请先在可信 PDF 阅读器中保存一份已解锁副本。',
        },
        {
          question: '为什么很大的 PDF 会比较慢？',
          answer: '本地处理会使用设备内存，大型扫描件或数百页文档需要更长时间，分批处理通常更稳定。',
        },
      ],
    },
  },
  document: {
    seoTitle: { en: 'Free DOCX and text tools online | FileTools', zh: '免费 Word 与文本转换工具｜FileTools' },
    seoDescription: {
      en: 'Convert DOCX to HTML or plain text, and create editable Word documents from text. Free local processing with no uploads.',
      zh: '免费将 DOCX 转为 HTML 或纯文本，也可从文本创建可编辑 Word 文档。浏览器本地处理，不上传文件。',
    },
    en: {
      heading: 'Convert Word documents and text in your browser',
      lead: 'Extract useful content from DOCX files or turn plain text into a simple, editable Word document.',
      overviewTitle: 'Move content between documents and the web',
      overview:
        'These focused tools help with content migration, note extraction, and simple document creation. Complex page layout may need cleanup, but the source file stays on your device during conversion.',
      useCasesTitle: 'Useful document workflows',
      useCases: [
        'Move an article from Word into a website editor.',
        'Extract readable text for notes or search.',
        'Create a clean DOCX draft from pasted text.',
      ],
      faq: [
        {
          question: 'Will DOCX to HTML preserve every layout detail?',
          answer:
            'Headings, paragraphs, lists, and common formatting convert best. Page headers, text boxes, and complex layouts may need manual cleanup.',
        },
        {
          question: 'Does text to DOCX create an editable file?',
          answer:
            'Yes. The result is a standard DOCX file that can be opened and edited in compatible word processors.',
        },
      ],
    },
    zh: {
      heading: '在浏览器中转换 Word 文档和文本',
      lead: '从 DOCX 提取有用内容，或将纯文本生成简单、可编辑的 Word 文档。',
      overviewTitle: '让内容在文档与网页之间流动',
      overview:
        '这些工具适合内容迁移、笔记提取和简单文档创建。复杂页面布局可能需要后续整理，但转换过程中源文件会留在你的设备上。',
      useCasesTitle: '实用文档工作流',
      useCases: [
        '把 Word 文章迁移到网站编辑器。',
        '提取可阅读文本用于笔记或搜索。',
        '从粘贴文本创建整洁的 DOCX 草稿。',
      ],
      faq: [
        {
          question: 'Word 转 HTML 会保留全部排版吗？',
          answer: '标题、段落、列表和常见格式的效果最好；页眉、文本框和复杂布局可能需要手动整理。',
        },
        {
          question: '文本转 Word 的结果可以编辑吗？',
          answer: '可以。结果是标准 DOCX 文件，可在兼容的文字处理软件中继续编辑。',
        },
      ],
    },
  },
  presentation: {
    seoTitle: {
      en: 'Free PowerPoint maker tools online | FileTools',
      zh: '免费 PPT 制作工具｜图片与文本生成 PPT｜FileTools',
    },
    seoDescription: {
      en: 'Create editable PPTX presentations from images or structured text in your browser. Free, private, and no upload required.',
      zh: '在浏览器中从图片或结构化文本创建可编辑 PPTX。免费、私密，无需上传文件。',
    },
    en: {
      heading: 'Create editable PowerPoint files from images or text',
      lead: 'Build a clean PPTX draft in seconds, then continue editing it in PowerPoint or another compatible app.',
      overviewTitle: 'Start the deck, skip the repetitive setup',
      overview:
        'Turn each image into a widescreen slide or split structured text into a simple presentation. The generated PPTX remains editable, so you can add your own theme, charts, and finishing details.',
      useCasesTitle: 'A faster start for common decks',
      useCases: [
        'Create a photo deck or visual portfolio.',
        'Turn an outline into editable slides.',
        'Package product screenshots for a quick review.',
      ],
      faq: [
        {
          question: 'Can I edit the generated presentation?',
          answer:
            'Yes. Open the PPTX in PowerPoint or another compatible application to change text, images, theme, and layout.',
        },
        {
          question: 'Will images be cropped?',
          answer:
            'Images are fitted within a widescreen slide while preserving their proportions, so differently shaped images may have whitespace.',
        },
      ],
    },
    zh: {
      heading: '从图片或文本创建可编辑 PowerPoint',
      lead: '几秒钟生成整洁的 PPTX 草稿，再到 PowerPoint 或兼容软件中继续编辑。',
      overviewTitle: '跳过重复设置，直接开始内容',
      overview:
        '可将每张图片生成一页宽屏幻灯片，或把结构化文本拆成简单演示文稿。生成的 PPTX 仍可编辑，方便继续添加主题、图表和细节。',
      useCasesTitle: '快速开始常见演示文稿',
      useCases: ['制作照片展示或视觉作品集。', '把提纲转换为可编辑幻灯片。', '将产品截图整理成快速评审材料。'],
      faq: [
        {
          question: '生成的演示文稿可以编辑吗？',
          answer: '可以。在 PowerPoint 或其他兼容软件中打开 PPTX，即可修改文字、图片、主题和布局。',
        },
        { question: '图片会被裁剪吗？', answer: '图片会在保持比例的情况下适配宽屏页面，不同比例的图片可能出现留白。' },
      ],
    },
  },
  archive: {
    seoTitle: {
      en: 'Free ZIP tools online – create and extract | FileTools',
      zh: '免费在线 ZIP 工具｜创建与解压｜FileTools',
    },
    seoDescription: {
      en: 'Create ZIP archives from multiple files or inspect and extract a ZIP locally in your browser. Free with no uploads.',
      zh: '在浏览器本地将多个文件创建为 ZIP，或查看并解压 ZIP 内容。免费使用，不上传文件。',
    },
    en: {
      heading: 'Create or extract ZIP archives in your browser',
      lead: 'Package files for sharing or inspect an archive and download only the entries you need.',
      overviewTitle: 'Simple archive work without an installed app',
      overview:
        'The ZIP tools run locally and work well for lightweight packaging and extraction. You can bundle several files into one download or inspect archive contents before saving them.',
      useCasesTitle: 'Everyday archive tasks',
      useCases: [
        'Bundle project files into one ZIP.',
        'Inspect an archive before downloading its contents.',
        'Extract individual files without installing another utility.',
      ],
      faq: [
        {
          question: 'Does the extractor support RAR or 7Z?',
          answer: 'No. The current archive tools are focused on the widely supported ZIP format.',
        },
        {
          question: 'Can I extract only one file?',
          answer: 'Yes. After processing a ZIP, each available entry can be downloaded individually.',
        },
      ],
    },
    zh: {
      heading: '在浏览器中创建或解压 ZIP',
      lead: '打包文件用于分享，或先查看压缩包内容，再下载真正需要的文件。',
      overviewTitle: '无需安装软件的简单压缩流程',
      overview:
        'ZIP 工具在本地运行，适合轻量打包和解压。你可以把多个文件整理为一个下载，也可以先查看压缩包内容再保存。',
      useCasesTitle: '日常压缩任务',
      useCases: ['将项目文件打包为一个 ZIP。', '下载内容前先查看压缩包。', '无需安装额外软件即可提取单个文件。'],
      faq: [
        { question: '支持 RAR 或 7Z 吗？', answer: '暂不支持。当前压缩工具专注于兼容性更广的 ZIP 格式。' },
        { question: '可以只解压一个文件吗？', answer: '可以。处理 ZIP 后，可以单独下载其中每个可用文件。' },
      ],
    },
  },
  data: {
    seoTitle: { en: 'Free JSON and CSV tools online | FileTools', zh: '免费 JSON 与 CSV 转换工具｜FileTools' },
    seoDescription: {
      en: 'Format and validate JSON, convert CSV to JSON, or turn JSON arrays into CSV. Fast browser-local data tools with no uploads.',
      zh: '格式化与校验 JSON、CSV 转 JSON、JSON 数组转 CSV。快速浏览器本地数据工具，无需上传。',
    },
    en: {
      heading: 'Format JSON and convert CSV data locally',
      lead: 'Clean up structured data, catch syntax errors, and move tables between JSON and CSV formats.',
      overviewTitle: 'Small data tasks without sending data away',
      overview:
        'Use the formatter for readable or minified JSON, or convert simple tables between CSV and JSON. All parsing and generation happens in the current browser session.',
      useCasesTitle: 'Useful for developers and spreadsheet workflows',
      useCases: [
        'Pretty-print an API response for inspection.',
        'Convert a CSV export into a JSON array.',
        'Prepare JSON records for a spreadsheet.',
      ],
      faq: [
        {
          question: 'What JSON shape is required for JSON to CSV?',
          answer: 'Use an array of objects. Object keys become CSV column headers and each object becomes one row.',
        },
        {
          question: 'Are large data files supported?',
          answer:
            'Performance depends on browser memory. For very large exports, a desktop data tool may be more reliable.',
        },
      ],
    },
    zh: {
      heading: '在本地格式化 JSON 并转换 CSV 数据',
      lead: '整理结构化数据、发现语法错误，并在 JSON 与 CSV 表格之间转换。',
      overviewTitle: '无需发送数据的小型数据任务',
      overview:
        '可以把 JSON 格式化为易读或紧凑内容，也可在 CSV 与 JSON 之间转换简单表格。解析和生成都发生在当前浏览器会话中。',
      useCasesTitle: '适合开发者和表格工作流',
      useCases: ['格式化 API 响应以便检查。', '将 CSV 导出转换为 JSON 数组。', '把 JSON 记录整理为电子表格格式。'],
      faq: [
        {
          question: 'JSON 转 CSV 需要什么结构？',
          answer: '请使用对象数组。对象键会成为 CSV 列标题，每个对象成为一行。',
        },
        {
          question: '支持很大的数据文件吗？',
          answer: '性能取决于浏览器内存。对于特别大的导出文件，桌面数据工具可能更稳定。',
        },
      ],
    },
  },
  utility: {
    seoTitle: {
      en: 'Free file utilities – checksum and Base64 | FileTools',
      zh: '免费文件实用工具｜校验值与 Base64｜FileTools',
    },
    seoDescription: {
      en: 'Calculate SHA checksums, encode files as Base64, or decode Base64 into a file. Free browser-local utilities with no upload.',
      zh: '计算 SHA 校验值、文件转 Base64，或将 Base64 解码为文件。免费浏览器本地工具，无需上传。',
    },
    en: {
      heading: 'Private file utilities for checksums and Base64',
      lead: 'Verify file integrity, encode a file for text transport, or turn Base64 data back into a download.',
      overviewTitle: 'Technical file tasks, handled on your device',
      overview:
        'These utilities use standard browser APIs for hashing and encoding. They are useful for quick verification, debugging, and moving small binary files through text-based workflows.',
      useCasesTitle: 'Quick utilities for technical work',
      useCases: [
        'Compare a downloaded file with a published SHA hash.',
        'Create a Base64 data URL for testing.',
        'Recover a downloadable file from Base64 text.',
      ],
      faq: [
        {
          question: 'Which checksum algorithms are available?',
          answer: 'You can calculate SHA-256, SHA-384, and SHA-512 checksums.',
        },
        {
          question: 'Does Base64 reduce file size?',
          answer: 'No. Base64 usually increases the text size; it is an encoding format, not compression.',
        },
      ],
    },
    zh: {
      heading: '用于校验值和 Base64 的私密文件工具',
      lead: '验证文件完整性、将文件编码为文本，或把 Base64 数据还原为可下载文件。',
      overviewTitle: '在设备上完成技术文件任务',
      overview:
        '这些实用工具使用标准浏览器 API 进行哈希和编码，适合快速校验、调试，以及在文本流程中传递小型二进制文件。',
      useCasesTitle: '技术工作中的快速工具',
      useCases: [
        '将下载文件与发布的 SHA 哈希进行比较。',
        '创建用于测试的 Base64 Data URL。',
        '从 Base64 文本还原可下载文件。',
      ],
      faq: [
        { question: '支持哪些校验算法？', answer: '可以计算 SHA-256、SHA-384 和 SHA-512 校验值。' },
        { question: 'Base64 会减小文件吗？', answer: '不会。Base64 通常会增加文本体积，它是编码格式，不是压缩方式。' },
      ],
    },
  },
}

export function getToolPageContent(tool: ToolDefinition, language: 'en' | 'zh') {
  const isZh = language === 'zh'
  const category = categoryPageContent[tool.category][language]
  const editorial = getToolEditorial(tool.id, language)
  const source =
    tool.input === 'text' || tool.input === 'base64'
      ? isZh
        ? '输入或粘贴内容'
        : 'Enter or paste the content'
      : isZh
        ? '选择或拖入文件'
        : 'Choose or drop your files'

  return {
    seoTitle: isZh ? `${tool.title.zh}在线免费使用｜FileTools` : `${tool.title.en} online – free & private | FileTools`,
    seoDescription: isZh
      ? `${tool.description.zh}免费在浏览器本地完成，无需注册或上传文件。`
      : `${tool.description.en} Free browser-local processing with no uploads or sign-up.`,
    steps: isZh
      ? [source, `点击“${tool.action.zh}”并等待浏览器完成处理`, '检查结果并下载到你的设备']
      : [
          source,
          `Select “${tool.action.en}” and let your browser process it`,
          'Review the result and download it to your device',
        ],
    whyTitle: isZh
      ? `为什么使用 FileTools ${tool.title.zh}？`
      : `Why use FileTools for ${tool.title.en.toLowerCase()}?`,
    whyText: editorial.overview,
    categoryLead: category.lead,
    editorial,
    reviewed: toolEditorial[tool.id].reviewed,
  }
}
