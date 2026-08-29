export type GuideLocaleContent = {
  title: string
  description: string
  toolLabel: string
  intro: string
  steps: string[]
  sections: Array<{ heading: string; paragraphs: string[] }>
}

export type Guide = {
  slug: string
  toolPath: string
  readingTime: string
  zh: GuideLocaleContent
  en: GuideLocaleContent
}

export const guides: Guide[] = [
  {
    slug: 'compress-images-without-upload',
    toolPath: '/compress-image',
    readingTime: '3 min',
    zh: {
      title: '不上传图片，如何在线压缩图片？',
      description: '了解浏览器本地压缩 JPG、PNG 和 WebP 的方法、适用场景和常见限制。',
      toolLabel: '立即压缩图片',
      intro:
        '图片太大时，上传表单、发送邮件或发布网页都会变慢。PixelForge 在浏览器中完成压缩，图片文件不会上传到服务器，适合处理不希望离开设备的素材。',
      steps: ['打开图片压缩工具，选择或拖入图片。', '选择输出格式、质量和目标宽度。', '开始处理，完成后下载压缩结果。'],
      sections: [
        {
          heading: '什么时候应该压缩图片？',
          paragraphs: [
            '如果图片用于网站、表单、邮件或社交平台，通常不需要保留相机原图的全部尺寸。适当降低宽度和质量，可以减少文件体积，同时保留足够清晰度。',
            '头像、缩略图和网页配图通常适合先调整尺寸，再选择 JPG 或 WebP 输出。需要透明背景时，应优先保留 PNG。',
          ],
        },
        {
          heading: '本地处理和上传处理有什么区别？',
          paragraphs: [
            '上传型工具会把文件发送到远程服务器处理，适合需要服务端转换或协作的场景。本地工具直接使用浏览器能力处理，网络传输更少，适合隐私敏感的截图、证件材料和工作文件。',
            '本地处理的限制是设备性能和浏览器内存会影响速度。单个文件过大或同时处理很多张图片时，可以分批操作。',
          ],
        },
      ],
    },
    en: {
      title: 'How to compress images online without uploading them',
      description: 'Learn when to compress JPG, PNG, and WebP images locally in your browser and what to expect.',
      toolLabel: 'Compress images now',
      intro:
        'Large images slow down forms, email attachments, and websites. PixelForge compresses images in your browser, so the files stay on your device instead of being uploaded to a server.',
      steps: [
        'Open the image compressor and choose or drop your images.',
        'Select an output format, quality, and target width.',
        'Start processing and download the compressed results.',
      ],
      sections: [
        {
          heading: 'When should you compress an image?',
          paragraphs: [
            'Images used for websites, forms, email, or social posts rarely need the full dimensions of a camera original. Reducing width and quality can make files much smaller while keeping them clear enough for their purpose.',
            'Avatars, thumbnails, and web graphics usually benefit from resizing first. Keep PNG when you need transparency; JPG and WebP are often better for photographs.',
          ],
        },
        {
          heading: 'Local processing versus uploading',
          paragraphs: [
            'Upload-based services send files to a remote server for processing. Local tools use your browser and reduce network transfer, which is useful for private screenshots, documents, and work materials.',
            'The trade-off is that speed depends on your device and browser memory. Process very large images in smaller batches when needed.',
          ],
        },
      ],
    },
  },
  {
    slug: 'merge-pdf-files',
    toolPath: '/pdf/merge',
    readingTime: '3 min',
    zh: {
      title: '如何把多个 PDF 合并成一个文件？',
      description: '用浏览器本地合并多个 PDF，了解文件顺序、隐私和处理失败时的检查方法。',
      toolLabel: '合并 PDF',
      intro:
        '合同附件、课程资料和扫描文件经常需要整理成一个 PDF。使用本地 PDF 合并工具可以直接在设备上完成整理，不需要把文件上传到第三方服务器。',
      steps: [
        '打开 PDF 合并工具并选择多个 PDF 文件。',
        '确认文件顺序，必要时重新选择正确顺序。',
        '点击合并并下载，保存生成的 PDF。',
      ],
      sections: [
        {
          heading: '合并前先检查什么？',
          paragraphs: [
            '先确认每个文件都能正常打开，并按照最终阅读顺序选择。文件名可以使用 01、02、03 这样的前缀，帮助你在文件选择器中快速排序。',
            '扫描件通常会让结果文件变大。如果合并后文件超过上传限制，可以再使用图片压缩或其他 PDF 压缩工具处理。',
          ],
        },
        {
          heading: '为什么合并过程可能失败？',
          paragraphs: [
            '受密码保护、损坏或使用特殊编码的 PDF 可能无法在浏览器中读取。遇到失败时，可以先用阅读器打开并另存为新的 PDF，再重新尝试。',
            '本地处理依赖设备内存。文件很多或页面非常多时，分成几批处理通常更稳定。',
          ],
        },
      ],
    },
    en: {
      title: 'How to merge multiple PDF files into one',
      description: 'Merge PDF files locally in your browser and learn how to preserve order and troubleshoot failures.',
      toolLabel: 'Merge PDFs',
      intro:
        'Contracts, course materials, and scanned pages often need to be organized into one PDF. A local PDF merger can do that on your device without sending files to a third-party server.',
      steps: [
        'Open the PDF merger and choose multiple PDF files.',
        'Check the file order and select them again if needed.',
        'Click merge and download the generated PDF.',
      ],
      sections: [
        {
          heading: 'What to check before merging',
          paragraphs: [
            'Make sure each file opens correctly and select files in the final reading order. Numbered filenames such as 01, 02, and 03 make sorting easier in a file picker.',
            'Scanned pages can make the result large. If the merged PDF is too large for an upload form, process the source images or use a dedicated PDF compressor.',
          ],
        },
        {
          heading: 'Why can a merge fail?',
          paragraphs: [
            'Password-protected, damaged, or unusually encoded PDFs may not be readable in a browser. Try opening the file in a PDF reader and saving a fresh copy before trying again.',
            'Local processing uses your device memory. Splitting a large batch into smaller groups is usually more reliable.',
          ],
        },
      ],
    },
  },
  {
    slug: 'convert-images-to-pdf',
    toolPath: '/pdf/images-to-pdf',
    readingTime: '3 min',
    zh: {
      title: '如何把多张图片转换成一个 PDF？',
      description: '将 JPG、PNG 和 WebP 图片整理成 PDF，适合扫描资料、照片和提交材料。',
      toolLabel: '图片转 PDF',
      intro:
        '把多张图片整理成 PDF，常用于提交扫描件、整理课堂笔记或发送照片合集。PixelForge 在浏览器内生成 PDF，原始图片不会上传。',
      steps: ['选择需要放进 PDF 的图片。', '按照页面顺序选择文件。', '生成并下载 PDF，打开后检查页面方向和清晰度。'],
      sections: [
        {
          heading: '怎样准备图片顺序？',
          paragraphs: [
            '如果页面顺序很重要，建议先把文件重命名为 01、02、03。不同操作系统的文件选择器排序规则可能不同，生成后应打开 PDF 检查顺序。',
            '横向和纵向图片可以放在同一个文件中，但页面方向会跟随图片尺寸。提交表格前，最好确认每页都能正常阅读。',
          ],
        },
        {
          heading: '生成的 PDF 太大怎么办？',
          paragraphs: [
            'PDF 大小主要取决于图片数量、分辨率和原始压缩方式。可以先将图片调整到实际需要的宽度，再生成 PDF，避免把相机原图直接放入文档。',
            '涉及证件或其他敏感材料时，本地处理可以减少上传环节，但仍应妥善保管最终下载文件。',
          ],
        },
      ],
    },
    en: {
      title: 'How to turn multiple images into one PDF',
      description: 'Create a PDF from JPG, PNG, and WebP images for scans, photos, notes, and submissions.',
      toolLabel: 'Images to PDF',
      intro:
        'Turning several images into one PDF is useful for scans, class notes, and photo collections. PixelForge creates the PDF in your browser, so the source images are not uploaded.',
      steps: [
        'Choose the images you want to include.',
        'Select them in the order you want the pages to appear.',
        'Create and download the PDF, then check its page orientation and clarity.',
      ],
      sections: [
        {
          heading: 'How to prepare the page order',
          paragraphs: [
            'When order matters, rename files with prefixes such as 01, 02, and 03. File picker sorting differs between operating systems, so open the PDF afterward to confirm the order.',
            'Landscape and portrait images can be combined, but each page follows its source dimensions. Check that every page is readable before submitting the document.',
          ],
        },
        {
          heading: 'What if the PDF is too large?',
          paragraphs: [
            'The final size depends on the number of images, their dimensions, and their original compression. Resize images to the width you actually need before creating the PDF instead of using camera originals.',
            'For identity documents or other private material, local processing reduces the upload step, but you should still store the downloaded file carefully.',
          ],
        },
      ],
    },
  },
  {
    slug: 'word-to-html-basics',
    toolPath: '/word/to-html',
    readingTime: '3 min',
    zh: {
      title: 'Word 文档转 HTML 时需要注意什么？',
      description: '了解 DOCX 转 HTML 能保留哪些内容，以及为什么复杂 Word 排版可能发生变化。',
      toolLabel: 'Word 转 HTML',
      intro:
        '把 Word 文档转换成 HTML，适合将文章内容迁移到网页、知识库或邮件编辑器。浏览器本地转换可以减少文件外传，但复杂排版不一定能完全还原。',
      steps: [
        '选择一个 DOCX 文件。',
        '等待浏览器提取标题、段落、列表和图片。',
        '下载 HTML 后，在浏览器中打开并检查结构。',
      ],
      sections: [
        {
          heading: '通常可以保留哪些内容？',
          paragraphs: [
            '常规标题、段落、粗体、列表和部分图片内容通常可以转换。建议在 Word 中使用清晰的标题层级和普通段落，避免依赖大量文本框来表达结构。',
            'HTML 是网页结构，不是 Word 页面布局的复制品。页眉、页脚、分页、复杂表格和特殊字体可能需要转换后手动调整。',
          ],
        },
        {
          heading: '转换后如何检查？',
          paragraphs: [
            '先检查标题顺序、链接、列表和图片是否存在，再检查移动端阅读效果。准备发布前，应清理不需要的样式，并确认图片尺寸不会撑破页面。',
            '如果文档包含敏感内容，下载 HTML 后请及时清理浏览器下载目录中的临时副本。',
          ],
        },
      ],
    },
    en: {
      title: 'What to know when converting a Word document to HTML',
      description: 'Learn what DOCX to HTML conversion can preserve and why complex Word layouts may change.',
      toolLabel: 'Convert Word to HTML',
      intro:
        'DOCX to HTML conversion is useful for moving articles into a website, knowledge base, or email editor. Browser-local conversion reduces file transfer, but complex page layouts may need manual cleanup.',
      steps: [
        'Choose a DOCX file.',
        'Let the browser extract headings, paragraphs, lists, and images.',
        'Download the HTML and open it in a browser to inspect the structure.',
      ],
      sections: [
        {
          heading: 'What usually carries over?',
          paragraphs: [
            'Regular headings, paragraphs, bold text, lists, and some image content usually convert well. Use clear heading levels and ordinary paragraphs in Word instead of relying heavily on text boxes.',
            'HTML is a web structure, not a pixel-perfect copy of a Word page. Headers, footers, page breaks, complex tables, and unusual fonts may need manual adjustments.',
          ],
        },
        {
          heading: 'How to review the result',
          paragraphs: [
            'Check heading order, links, lists, and images first, then test the result on a narrow screen. Before publishing, remove unnecessary styles and confirm that images do not overflow the page.',
            'If the document contains private information, clear temporary copies from your downloads folder after you finish.',
          ],
        },
      ],
    },
  },
  {
    slug: 'make-a-presentation-from-images',
    toolPath: '/ppt/images-to-pptx',
    readingTime: '3 min',
    zh: {
      title: '如何用多张图片快速生成 PPT？',
      description: '把每张图片生成一页宽屏 PPTX，适合照片展示、作品集和简单汇报。',
      toolLabel: '图片生成 PPT',
      intro:
        '当每张图片都需要占据一页时，批量生成 PPTX 比手动插入更快。PixelForge 会按选择顺序生成宽屏幻灯片，并在浏览器中完成处理。',
      steps: [
        '选择需要放入演示文稿的图片。',
        '按幻灯片顺序选择文件。',
        '生成 PPTX，并在 PowerPoint 或兼容软件中检查页面。',
      ],
      sections: [
        {
          heading: '适合哪些场景？',
          paragraphs: [
            '它适合照片墙、作品集、产品截图和需要一图一页的简单汇报。每张图片会作为一页宽屏幻灯片，适合快速整理素材。',
            '如果需要复杂动画、可编辑文字、图表或统一母版，仍然应该在 PowerPoint 中继续编辑。',
          ],
        },
        {
          heading: '如何让幻灯片更整齐？',
          paragraphs: [
            '尽量统一图片比例和方向，并在生成前按 01、02、03 重命名文件。比例差异较大的图片可能出现留白，这是为了保持图片完整而不是裁剪内容。',
            '生成后检查第一张、最后一张和几张比例不同的图片，确认演示软件能够正常打开文件。',
          ],
        },
      ],
    },
    en: {
      title: 'How to create a PowerPoint from multiple images',
      description:
        'Turn each image into a widescreen PPTX slide for photo decks, portfolios, and simple presentations.',
      toolLabel: 'Create a PPT from images',
      intro:
        'When every image should fill one slide, creating a PPTX in bulk is faster than inserting files one by one. PixelForge creates widescreen slides in the order you select the images and processes them in your browser.',
      steps: [
        'Choose the images for your presentation.',
        'Select them in slide order.',
        'Create the PPTX and check it in PowerPoint or a compatible app.',
      ],
      sections: [
        {
          heading: 'When is this workflow useful?',
          paragraphs: [
            'It works well for photo decks, portfolios, product screenshots, and simple image-per-slide reports. Each image becomes one widescreen slide for quick organization.',
            'For complex animations, editable text, charts, or a shared master layout, continue editing the generated deck in PowerPoint.',
          ],
        },
        {
          heading: 'How to keep the slides consistent',
          paragraphs: [
            'Use a consistent image ratio and orientation when possible, and rename files with 01, 02, and 03 prefixes before selecting them. Images with different ratios may show whitespace to avoid cropping content.',
            'Check the first, last, and a few differently sized images after generation to confirm the deck opens correctly in your presentation software.',
          ],
        },
      ],
    },
  },
]

export function getGuide(slug: string | undefined) {
  return guides.find((guide) => guide.slug === slug)
}
