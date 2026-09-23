import type { ToolEditorial } from '../tools/editorial'

export const conversionEditorial = {
  'word-to-pdf': {
    reviewed: '2026-09-23',
    en: {
      overview:
        'Turn a modern Word document into a PDF without sending its contents to a conversion server. FileTools renders the DOCX in an isolated browser document, captures its pages, and packages them into a PDF you can download immediately.',
      bestFor: 'Sharing everyday letters, illustrated notes, and simple documents as a fixed visual copy.',
      input: 'One .docx document, up to 50 MB. Save legacy .doc files as DOCX in Word first.',
      output: 'An image-based PDF with a preview of the first page and a direct download button.',
      limitation:
        'This is a browser renderer, not Microsoft Office. Text in the resulting PDF is not selectable. Missing fonts, complex tables, fields, and automatic pagination may differ from Word; review the output before sharing.',
      tips: [
        'Use explicit page breaks and common fonts for predictable page boundaries.',
        'Check tables, headers, and page endings in the downloaded PDF; keep the source DOCX for editing.',
      ],
    },
    zh: {
      overview:
        '将现代 Word 文档转为 PDF，无需将内容交给转换服务器。FileTools 在隔离的浏览器文档中渲染 DOCX，逐页生成画面并打包为可直接下载的 PDF，适合日常分享。',
      bestFor: '分享普通信件、图文笔记和简单文档的固定外观副本。',
      input: '单个不超过 50 MB 的 DOCX；旧版 DOC 请先在 Word 中另存为 DOCX。',
      output: '基于页面图片的 PDF，包含首页预览与直接下载按钮。',
      limitation:
        '这是浏览器渲染器，并非 Microsoft Office。输出 PDF 的文字不可选择；缺失字体、复杂表格、域和自动分页可能与 Word 不同，分享前请检查。',
      tips: [
        '使用显式分页符和常见字体，能获得更可预测的分页效果。',
        '下载后检查表格、页眉和页尾，保留 DOCX 原文件用于编辑。',
      ],
    },
  },
  'pdf-to-word': {
    reviewed: '2026-09-23',
    en: {
      overview:
        'Choose how to move PDF content into Word: extract the text layer into editable paragraphs, or preserve each page as a picture inside a DOCX. Select a page range and convert locally, with no account or file upload required.',
      bestFor: 'Reusing text from reports, or placing scanned pages into a Word document for annotation.',
      input: 'One PDF up to 50 MB and 100 selected pages; an opening password can be supplied locally.',
      output: 'A .docx file containing editable paragraphs or page-sized images, depending on your chosen mode.',
      limitation:
        'Text mode approximates indents, font sizes, and line spacing but does not reconstruct tables, columns, or embedded pictures. Image-only pages are included as pictures and are not editable. OCR is not included. Appearance mode preserves pixels, not editable layout.',
      tips: [
        'Use editable text for PDFs with selectable text; choose appearance for scans or complex layouts.',
        'Check reading order and special characters in Word, especially when the source has several columns.',
      ],
    },
    zh: {
      overview:
        '按用途选择 PDF 转 Word 模式：将文字层提取为可编辑段落，或者将每页作为图片保存在 DOCX 中。支持指定页码范围和浏览器本地转换，无需账号或上传文件。',
      bestFor: '复用报告文字，或将扫描页面放入 Word 中添加批注。',
      input: '单个不超过 50 MB 的 PDF，最多选择 100 页；打开密码仅在本地使用。',
      output: '按所选模式生成包含可编辑段落或整页图片的 DOCX 文件。',
      limitation:
        '文字模式会近似保留缩进、字号和行距，但不还原表格、分栏和内嵌图片。纯扫描页面以不可编辑的图片保留；不包含 OCR。外观模式保留画面，而非可编辑的排版结构。',
      tips: [
        '可选择文字的 PDF 适合文字模式，扫描件或复杂排版适合保留外观。',
        '请在 Word 中检查阅读顺序和特殊字符，多栏文档尤其需要复核。',
      ],
    },
  },
  'pdf-to-images': {
    reviewed: '2026-09-23',
    en: {
      overview:
        'Render selected PDF pages into individual JPG pictures and download them together as a ZIP archive. FileTools reads the PDF locally and lets you choose a standard or sharper rendering quality for slides, previews, and sharing.',
      bestFor: 'Creating document previews, sharing single pages, and inserting PDF pages into presentations.',
      input: 'One PDF up to 50 MB. Choose all pages or a comma-separated range such as 1,3-5.',
      output: 'A ZIP archive of JPG images named with the original PDF page numbers.',
      limitation:
        'JPG does not preserve selectable text, transparency, hyperlinks, or vector editing. Rendering is capped to protect browser memory, so very large pages are downscaled.',
      tips: [
        'Choose only the pages you need to reduce processing time and the ZIP size.',
        'Use the sharper setting for small printed text, then inspect an exported image at full size.',
      ],
    },
    zh: {
      overview:
        '把选中的 PDF 页面渲染为独立 JPG 图片，并通过 ZIP 压缩包一次下载。FileTools 在本地读取文档，可选择标准或清晰画质，适合制作预览、演示素材和分享页面。',
      bestFor: '制作文档预览、分享单页以及将 PDF 页面插入演示文稿。',
      input: '单个不超过 50 MB 的 PDF，可选择全部页面或输入 1,3-5 等范围。',
      output: '包含 JPG 图片的 ZIP 压缩包，文件名保留原 PDF 页码。',
      limitation: 'JPG 不保留可选文字、透明度、超链接或矢量编辑能力。为保护浏览器内存，超大页面会缩小到安全渲染尺寸。',
      tips: ['只选择需要的页面，可减少处理时间和压缩包体积。', '细小文字可选择清晰画质，并以原始大小检查导出图片。'],
    },
  },
  'pdf-to-text': {
    reviewed: '2026-09-23',
    en: {
      overview:
        'Extract the existing text layer from a PDF into a plain UTF-8 file. The tool groups words into lines, keeps page separators, and provides a text preview before download, making it useful for searching and reusing written content.',
      bestFor: 'Copying report text, making searchable notes, and moving paragraphs into another editor.',
      input: 'One PDF with selectable text, up to 50 MB and 100 selected pages.',
      output: 'A UTF-8 .txt document with page markers and the extracted text in reading order.',
      limitation:
        'Scanned images contain no text layer and require OCR, which this tool does not provide. Multi-column reading order, unusual fonts, and tables may need manual cleanup.',
      tips: [
        'Try selecting a sentence in a PDF reader first to check whether a text layer exists.',
        'If a page is a scan, use PDF to Word in appearance mode to retain a visual copy instead.',
      ],
    },
    zh: {
      overview:
        '将 PDF 中已有的文字层提取为 UTF-8 纯文本文件。工具会按行组合文字、保留页面分隔，并在下载前显示文本预览，方便搜索、整理笔记和复用书面内容。',
      bestFor: '复制报告文字、制作可搜索笔记以及把段落移到其他编辑器。',
      input: '含可选择文字的 PDF，不超过 50 MB，最多选择 100 页。',
      output: '带页面标记和提取文字的 UTF-8 TXT 文档。',
      limitation:
        '扫描图片没有文字层，需要 OCR，而本工具不提供 OCR。多栏阅读顺序、特殊字体和表格内容可能需要手动整理。',
      tips: [
        '先在 PDF 阅读器中尝试选择一句话，确认文件是否包含文字层。',
        '如果页面是扫描件，可使用 PDF 转 Word 的保留外观模式保存画面。',
      ],
    },
  },
} satisfies Record<string, ToolEditorial>
