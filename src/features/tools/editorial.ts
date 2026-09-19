import type { ToolId } from './types'

export type ToolEditorialLocale = {
  overview: string
  bestFor: string
  input: string
  output: string
  limitation: string
  tips: string[]
}

export type ToolEditorial = {
  reviewed: string
  en: ToolEditorialLocale
  zh: ToolEditorialLocale
}

const reviewed = '2026-09-19'

export const toolEditorial: Record<ToolId, ToolEditorial> = {
  'image-compress': {
    reviewed,
    en: {
      overview:
        'Image compression re-encodes a picture with a quality setting chosen in the image studio. It is most useful when an upload limit, website performance target, or email attachment size matters more than retaining every original byte.',
      bestFor: 'Website photos, form uploads, email attachments, and copies intended for quick sharing.',
      input: 'JPG, PNG, or WebP images. Multiple files can be processed in one batch.',
      output: 'New image files in the selected format and quality, with the originals left unchanged.',
      limitation:
        'PNG screenshots and graphics may become larger when converted to a photographic format. Very low quality settings can introduce visible blocks, halos, or blurred text.',
      tips: [
        'Try WebP at 75–85 quality for photographs, then compare the result at 100% zoom.',
        'For screenshots with sharp text or transparency, compare PNG and WebP instead of assuming JPG will be smaller.',
      ],
    },
    zh: {
      overview:
        '图片压缩会按照图片工作台中选择的质量重新编码文件。它适合需要满足上传大小、提升网页加载速度或减小邮件附件，同时不要求保留原始字节的场景。',
      bestFor: '网页照片、表单上传、邮件附件和快速分享副本。',
      input: 'JPG、PNG 或 WebP 图片，可一次批量处理多张。',
      output: '按所选格式和质量生成新图片，原文件保持不变。',
      limitation: 'PNG 截图或图形转为照片格式后可能反而变大；质量过低会出现色块、边缘光晕或文字模糊。',
      tips: [
        '照片可先尝试 WebP 75–85 质量，再以 100% 比例检查结果。',
        '含清晰文字或透明背景的截图应比较 PNG 与 WebP，不要默认 JPG 更小。',
      ],
    },
  },
  'image-convert': {
    reviewed,
    en: {
      overview:
        'Format conversion changes how image pixels are stored so a file can match a website, app, or editing workflow. The tool decodes the source in the browser and creates a fresh JPG, PNG, or WebP copy.',
      bestFor:
        'Upload forms with format restrictions, transparent graphics, browser-ready assets, and compatibility copies.',
      input: 'JPG, PNG, or WebP images, including batches with mixed supported formats.',
      output: 'A new JPG, PNG, or WebP file for every successfully decoded source image.',
      limitation:
        'JPG cannot preserve transparency. Converting a lossy image repeatedly cannot restore detail and may reduce quality further.',
      tips: [
        'Choose PNG when transparency or crisp interface graphics matter.',
        'Choose JPG for photographs without transparency and WebP when modern web delivery is the priority.',
      ],
    },
    zh: {
      overview:
        '格式转换会改变图片像素的存储方式，使文件符合网站、应用或编辑流程的要求。工具在浏览器中解码源文件，并生成新的 JPG、PNG 或 WebP 副本。',
      bestFor: '有格式限制的上传表单、透明图形、网页素材和兼容副本。',
      input: 'JPG、PNG 或 WebP 图片，支持混合格式批量选择。',
      output: '为每个成功读取的源图片生成新的 JPG、PNG 或 WebP 文件。',
      limitation: 'JPG 无法保留透明背景；反复转换有损图片不能恢复细节，还可能继续降低质量。',
      tips: ['透明背景或界面图形优先使用 PNG。', '无透明背景的照片可选 JPG，面向现代网页交付时可优先比较 WebP。'],
    },
  },
  'image-resize': {
    reviewed,
    en: {
      overview:
        'Resizing changes pixel dimensions rather than merely changing the displayed size. Reducing oversized photos before publishing can lower transfer size and prevent a website or form from doing an unpredictable resize later.',
      bestFor: 'Profile photos, product images, form submissions, thumbnails, and responsive website assets.',
      input: 'JPG, PNG, or WebP images plus a target width.',
      output: 'New images resized proportionally unless different dimensions are explicitly selected in the studio.',
      limitation:
        'Enlarging a small source does not create real detail and can make edges look soft. Large dimensions also require more browser memory.',
      tips: [
        'Use the actual maximum display width instead of exporting an unnecessarily large image.',
        'Keep proportions enabled for photos and logos unless stretching is intentional.',
      ],
    },
    zh: {
      overview:
        '调整尺寸会改变真实像素，而不只是改变页面上的显示大小。发布前缩小过大的照片，可以降低传输体积，也能避免网站或表单之后进行不可控的二次缩放。',
      bestFor: '头像、商品图、表单材料、缩略图和响应式网站素材。',
      input: 'JPG、PNG 或 WebP 图片，以及目标宽度。',
      output: '默认按比例生成新图片，也可以在工作台中设置其他尺寸。',
      limitation: '放大小图不会产生真实细节，边缘可能变软；较大尺寸也会占用更多浏览器内存。',
      tips: ['按实际最大显示宽度导出，避免保留无用的大尺寸。', '照片和标志通常应保持比例，除非确实需要拉伸效果。'],
    },
  },
  'image-rotate': {
    reviewed,
    en: {
      overview:
        'Rotation rewrites the image pixels into the selected orientation. It is useful when camera metadata is ignored by another app or a scan was captured sideways.',
      bestFor: 'Phone photos, scanned receipts, document images, and assets with an incorrect visible orientation.',
      input: 'JPG, PNG, or WebP images and a 90°, 180°, or 270° rotation.',
      output: 'A newly encoded image with the rotation applied to its pixels.',
      limitation:
        'Metadata outside the visible pixels may not be copied. Re-encoding a JPG can introduce a small additional quality loss.',
      tips: [
        'Preview the result before downloading a large batch.',
        'If the original only looks rotated in one program, test the downloaded result in a second viewer.',
      ],
    },
    zh: {
      overview: '旋转会把像素真正写入所选方向，适合其他应用忽略相机方向信息，或扫描件拍成横向的情况。',
      bestFor: '手机照片、票据扫描图、文档图片和显示方向错误的素材。',
      input: 'JPG、PNG 或 WebP 图片，以及 90°、180° 或 270° 角度。',
      output: '将旋转写入像素后的新图片。',
      limitation: '像素之外的部分元数据可能不会保留；重新编码 JPG 可能产生轻微的额外质量损失。',
      tips: ['批量下载前先预览一张结果。', '如果原图只在某个程序中显示方向错误，请在第二个查看器中检查下载结果。'],
    },
  },
  'image-flip': {
    reviewed,
    en: {
      overview:
        'Flipping mirrors the image pixels across a horizontal or vertical axis. Unlike rotation, it reverses the visible arrangement and can correct mirrored camera captures or prepare symmetrical design variations.',
      bestFor: 'Mirrored selfies, layout variations, directional graphics, and correcting reversed scans.',
      input: 'JPG, PNG, or WebP images with a horizontal, vertical, or combined flip selection.',
      output: 'A mirrored copy while the source image remains untouched.',
      limitation:
        'Any readable text in the image is mirrored too. A flip cannot correct perspective distortion or camera angle.',
      tips: [
        'Check logos and text carefully before using a flipped image.',
        'Use horizontal flip for a mirror effect and vertical flip for an upside-down reflection.',
      ],
    },
    zh: {
      overview:
        '翻转会沿水平轴或垂直轴镜像像素。它不同于旋转，会反转画面排列，可用于修正镜像拍摄或制作对称的设计版本。',
      bestFor: '镜像自拍、版式变化、带方向的图形和反向扫描图。',
      input: 'JPG、PNG 或 WebP 图片，以及水平、垂直或组合翻转设置。',
      output: '生成镜像副本，源图片保持不变。',
      limitation: '图片中的文字也会被镜像；翻转不能修正透视变形或拍摄角度。',
      tips: ['使用翻转结果前仔细检查标志和文字。', '水平翻转产生镜面效果，垂直翻转产生上下倒影效果。'],
    },
  },
  'pdf-merge': {
    reviewed,
    en: {
      overview:
        'PDF merging copies pages from several documents into one new file in the same order that the files were selected. It is a page-level operation and does not rasterize ordinary PDF pages.',
      bestFor:
        'Combining applications, invoices, course notes, reports, or scanned sections into one ordered document.',
      input: 'Two or more readable, unencrypted PDF files.',
      output: 'One merged PDF containing every source page in selected file order.',
      limitation:
        'Passwords, damaged cross-reference tables, signatures, form behavior, bookmarks, and document-level metadata may prevent processing or may not carry over.',
      tips: [
        'Rename files with numeric prefixes before selecting them if order is important.',
        'Open the merged result and verify the first, last, and boundary pages between source documents.',
      ],
    },
    zh: {
      overview:
        'PDF 合并会按照文件选择顺序，把多个文档的页面复制到一个新文件中。它是页面级操作，普通 PDF 页面不会被转成图片。',
      bestFor: '将申请材料、发票、课程笔记、报告或分段扫描件整理成一个有序文档。',
      input: '两个或更多可读取且未加密的 PDF 文件。',
      output: '一个包含全部源页面、顺序与文件选择一致的合并 PDF。',
      limitation: '密码、文件损坏、数字签名、表单行为、书签和文档元数据可能导致处理失败或无法完整保留。',
      tips: [
        '顺序重要时，可在选择前给文件名加数字前缀。',
        '打开结果并检查第一页、最后一页，以及每两个源文档的交界页面。',
      ],
    },
  },
  'pdf-split': {
    reviewed,
    en: {
      overview:
        'Splitting creates a separate one-page PDF for every page in the source. The results are packaged for download so a large document can be filed, shared, or reviewed page by page.',
      bestFor: 'Separating scanned forms, distributing handouts, extracting receipts, or archiving pages individually.',
      input: 'One readable, unencrypted PDF.',
      output: 'One PDF per source page, downloaded together as a ZIP when there are multiple results.',
      limitation: 'A document with hundreds of pages can use substantial memory and create many output files.',
      tips: [
        'Use Extract pages instead when only a few pages are needed.',
        'Check the generated filenames before placing the files into an existing numbered folder.',
      ],
    },
    zh: {
      overview: 'PDF 拆分会为源文件的每一页生成独立 PDF，便于逐页归档、分享或审核；多个结果会整理后下载。',
      bestFor: '拆分扫描表单、分发讲义、提取票据或按页归档。',
      input: '一个可读取且未加密的 PDF。',
      output: '每个源页面对应一个 PDF，多文件结果会通过 ZIP 一起下载。',
      limitation: '数百页的文档会占用较多内存，并生成大量输出文件。',
      tips: ['只需要少数页面时应使用“提取 PDF 页面”。', '放入已有编号文件夹前，先检查生成的文件名。'],
    },
  },
  'pdf-extract-pages': {
    reviewed,
    en: {
      overview:
        'Page extraction creates a smaller PDF containing only the page numbers you specify. The selected pages retain their requested order, making it possible to build a focused handout without changing the source.',
      bestFor:
        'Submitting selected evidence, sharing a chapter, keeping specific invoices, or creating a short review packet.',
      input: 'One readable PDF and a range such as 1-3, 5.',
      output: 'One new PDF containing only the selected pages.',
      limitation: 'Page numbers must exist in the source. Password-protected or malformed PDFs may not open.',
      tips: [
        'Count pages using the PDF viewer page number rather than a printed number inside the document.',
        'Review the output order whenever the range contains separate groups.',
      ],
    },
    zh: {
      overview: '页面提取会创建一个只包含指定页码的小型 PDF，并按照输入范围保留页面顺序，不会修改源文件。',
      bestFor: '提交部分证明、分享章节、保留指定发票或制作简短审阅材料。',
      input: '一个可读取的 PDF，以及类似 1-3, 5 的页码范围。',
      output: '一个只包含所选页面的新 PDF。',
      limitation: '页码必须存在于源文件中；带密码或结构损坏的 PDF 可能无法打开。',
      tips: ['应使用 PDF 阅读器显示的页码，而不是文档内部印刷的页码。', '范围包含多组页码时，请检查输出顺序。'],
    },
  },
  'pdf-remove-pages': {
    reviewed,
    en: {
      overview:
        'Page removal builds a new copy while omitting the selected pages. It is safer than overwriting because the original document remains available for recovery or comparison.',
      bestFor:
        'Removing blank scans, duplicate pages, outdated appendices, or pages containing information that should not be shared.',
      input: 'One readable PDF and the page numbers to exclude.',
      output: 'A new PDF containing every page except the selected range.',
      limitation:
        'At least one page must remain. Removing a visible page does not guarantee hidden metadata or attachments are removed.',
      tips: [
        'For sensitive redaction, use a dedicated redaction tool rather than deleting only visible pages.',
        'Check the page before and after every removed range to confirm continuity.',
      ],
    },
    zh: {
      overview: '删除页面会在省略指定页的情况下生成新副本。由于不会覆盖原文件，因此更便于恢复和对照。',
      bestFor: '移除空白扫描页、重复页、过期附录或不应分享的整页信息。',
      input: '一个可读取的 PDF，以及需要排除的页码。',
      output: '一个包含所选范围之外全部页面的新 PDF。',
      limitation: '至少必须保留一页；删除可见页面不能保证隐藏元数据或附件也被移除。',
      tips: [
        '敏感内容遮盖应使用专门的脱敏工具，而不是只删除可见页面。',
        '检查每个删除范围前后的页面，确认阅读连续性。',
      ],
    },
  },
  'pdf-rotate-pages': {
    reviewed,
    en: {
      overview:
        'PDF page rotation changes the page orientation stored in a new document. You can rotate every page or only a range, which is useful for mixed portrait and landscape scans.',
      bestFor: 'Sideways scans, mixed-orientation reports, photographed forms, and presentation handouts.',
      input: 'One readable PDF, a page range or all pages, and a 90°, 180°, or 270° angle.',
      output: 'A new PDF with rotation applied to the requested pages.',
      limitation: 'Rotation does not deskew a crooked scan or change the actual paper dimensions.',
      tips: [
        'Use a specific page range when only inserts or scanned pages are sideways.',
        'Check print preview after rotating documents intended for paper output.',
      ],
    },
    zh: {
      overview: 'PDF 页面旋转会把页面方向写入新文档，可以处理全部页面或指定范围，适合横向与纵向混合的扫描件。',
      bestFor: '横置扫描件、混合方向报告、拍摄表单和演示讲义。',
      input: '一个可读取的 PDF、全部或指定页码，以及 90°、180° 或 270° 角度。',
      output: '一个在指定页面应用旋转的新 PDF。',
      limitation: '旋转不能校正倾斜扫描，也不会改变真实纸张尺寸。',
      tips: ['只有插页或扫描页方向错误时，请输入具体页码范围。', '用于纸质打印的文档旋转后应检查打印预览。'],
    },
  },
  'images-to-pdf': {
    reviewed,
    en: {
      overview:
        'Images to PDF places each selected picture on its own PDF page. Images are fitted within the page while preserving their proportions, creating a portable document from scans or photos.',
      bestFor: 'Receipts, whiteboard photos, application scans, artwork collections, and simple photo handouts.',
      input: 'One or more JPG, PNG, or WebP images in the desired page order.',
      output: 'One PDF with one image per page.',
      limitation: 'The result contains image pages, not searchable OCR text. Very large photos can make the PDF large.',
      tips: [
        'Compress oversized camera photos first when the final PDF must meet an upload limit.',
        'Arrange or rename images before selection so the page order is easy to verify.',
      ],
    },
    zh: {
      overview: '图片转 PDF 会把每张所选图片放入单独页面，并在保持比例的情况下适配页面，从扫描图或照片生成便携文档。',
      bestFor: '票据、白板照片、申请材料扫描件、作品集和简单图片讲义。',
      input: '一张或多张 JPG、PNG 或 WebP 图片，选择顺序即页面顺序。',
      output: '一个每页包含一张图片的 PDF。',
      limitation: '结果是图片页面，不包含可搜索的 OCR 文字；超大照片会使 PDF 体积较大。',
      tips: ['最终 PDF 有上传限制时，可先压缩相机原图。', '选择前先整理或重命名图片，方便核对页面顺序。'],
    },
  },
  'docx-to-html': {
    reviewed,
    en: {
      overview:
        'DOCX to HTML extracts semantic document content for use in a web editor. Headings, paragraphs, lists, links, tables, and embedded images convert more reliably than page-specific Word layout.',
      bestFor:
        'Migrating articles to a CMS, preparing accessible web drafts, and recovering structured content from Word.',
      input: 'One modern .docx file that is not password protected.',
      output: 'HTML text that can be copied or downloaded for further editing.',
      limitation:
        'Headers, footers, floating text boxes, exact fonts, tracked changes, and pagination are not reproduced exactly.',
      tips: [
        'Use real Word heading styles before conversion instead of manually enlarged body text.',
        'Review links, tables, image captions, and list nesting in the destination editor.',
      ],
    },
    zh: {
      overview:
        'Word 转 HTML 会提取适合网页编辑器的语义内容。标题、段落、列表、链接、表格和嵌入图片通常比依赖页面位置的 Word 排版更容易转换。',
      bestFor: '迁移文章到 CMS、准备无障碍网页草稿，以及从 Word 恢复结构化内容。',
      input: '一个未加密码的现代 .docx 文件。',
      output: '可复制或下载、便于继续编辑的 HTML 文本。',
      limitation: '页眉页脚、浮动文本框、精确字体、修订记录和分页不能保证完全还原。',
      tips: ['转换前使用真正的 Word 标题样式，不要只放大正文。', '在目标编辑器中检查链接、表格、图片说明和列表层级。'],
    },
  },
  'docx-to-text': {
    reviewed,
    en: {
      overview:
        'DOCX to text removes most presentation formatting and extracts readable words in document order. The simpler result is easier to search, quote, analyze, or move into a plain-text system.',
      bestFor:
        'Notes, search indexing, proofreading, text analysis, and copying content into systems that reject Word files.',
      input: 'One readable .docx document.',
      output: 'A UTF-8 plain-text file containing the extracted document text.',
      limitation:
        'Images, visual layout, colors, headers, and many table relationships are not represented in plain text.',
      tips: [
        'Compare section boundaries when the source uses columns or text boxes.',
        'Use DOCX to HTML instead when headings, lists, or links need to remain structured.',
      ],
    },
    zh: {
      overview:
        'Word 转文本会移除大部分视觉格式，并按文档顺序提取可读文字。简单结果更适合搜索、引用、分析或迁移到纯文本系统。',
      bestFor: '笔记、搜索索引、校对、文本分析，以及复制到不接受 Word 文件的系统。',
      input: '一个可读取的 .docx 文档。',
      output: '包含所提取文档文字的 UTF-8 纯文本文件。',
      limitation: '图片、视觉布局、颜色、页眉和许多表格关系无法在纯文本中表达。',
      tips: ['源文件使用分栏或文本框时，应对照检查段落边界。', '需要保留标题、列表或链接结构时，请改用 Word 转 HTML。'],
    },
  },
  'text-to-docx': {
    reviewed,
    en: {
      overview:
        'Text to DOCX packages plain text into a standard editable Word document. It provides a clean starting file rather than attempting to infer a complex design from unformatted input.',
      bestFor:
        'Drafts, meeting notes, copied text, simple letters, and content that needs to enter a Word-based workflow.',
      input: 'Plain text typed or pasted into the editor.',
      output: 'An editable .docx file with basic paragraphs.',
      limitation:
        'The generator does not automatically create advanced styles, tables, images, headers, citations, or page layouts.',
      tips: [
        'Separate paragraphs with blank lines before generating the file.',
        'Apply final heading styles, margins, and page numbers in Word after download.',
      ],
    },
    zh: {
      overview:
        '文本转 Word 会把纯文本打包成标准、可编辑的 Word 文档，提供干净的起点，而不会从无格式输入中猜测复杂设计。',
      bestFor: '草稿、会议记录、复制文字、简单信件和需要进入 Word 流程的内容。',
      input: '在编辑框中输入或粘贴的纯文本。',
      output: '带有基础段落的可编辑 .docx 文件。',
      limitation: '不会自动创建高级样式、表格、图片、页眉、引用或复杂页面布局。',
      tips: ['生成前使用空行分隔段落。', '下载后在 Word 中设置最终标题样式、页边距和页码。'],
    },
  },
  'images-to-pptx': {
    reviewed,
    en: {
      overview:
        'Images to PPTX creates a widescreen presentation with one selected image on each slide. Every image is fitted without changing its proportions, giving you an editable deck shell for later refinement.',
      bestFor: 'Photo decks, portfolios, product screenshots, visual reviews, and turning exported charts into slides.',
      input: 'One or more JPG, PNG, or WebP images in presentation order.',
      output: 'An editable .pptx file with one image per widescreen slide.',
      limitation:
        'Different image ratios can leave whitespace. The tool does not add captions, themes, transitions, or speaker notes.',
      tips: [
        'Use images with consistent dimensions for a more uniform deck.',
        'Open the result in PowerPoint or a compatible editor to add titles, alt text, and a theme.',
      ],
    },
    zh: {
      overview: '图片生成 PPT 会创建宽屏演示文稿，每张所选图片占一页，并在保持比例的情况下适配，便于之后继续编辑。',
      bestFor: '照片展示、作品集、产品截图、视觉评审和把导出图表整理成幻灯片。',
      input: '一张或多张 JPG、PNG 或 WebP 图片，选择顺序即演示顺序。',
      output: '一个每页含一张图片的可编辑 .pptx 文件。',
      limitation: '不同比例的图片可能出现留白；工具不会自动添加说明、主题、转场或演讲者备注。',
      tips: ['使用尺寸一致的图片可让演示更统一。', '在 PowerPoint 或兼容软件中添加标题、替代文本和主题。'],
    },
  },
  'text-to-pptx': {
    reviewed,
    en: {
      overview:
        'Text to PPTX turns separated text sections into a simple editable slide outline. The first line of each section becomes a title and the remaining lines become slide content.',
      bestFor: 'Early presentation drafts, meeting agendas, lesson outlines, and quickly testing a talk structure.',
      input: 'Structured plain text with blank lines between slide sections.',
      output: 'An editable .pptx deck with basic titles and text.',
      limitation:
        'The result is intentionally plain and does not generate charts, sourced images, branded themes, or polished layouts.',
      tips: [
        'Keep one idea per section and use short lines for readable slides.',
        'Treat the output as a draft; verify overflow and add visual hierarchy in a slide editor.',
      ],
    },
    zh: {
      overview: '文本生成 PPT 会把分段文本转换为简单、可编辑的幻灯片提纲。每段第一行成为标题，其余行成为页面内容。',
      bestFor: '演示初稿、会议议程、课程提纲和快速验证演讲结构。',
      input: '使用空行分隔幻灯片段落的结构化纯文本。',
      output: '包含基础标题和正文的可编辑 .pptx 文件。',
      limitation: '结果刻意保持简洁，不会自动生成图表、来源图片、品牌主题或精细版式。',
      tips: ['每段只表达一个主题，并使用短句保持可读。', '把结果视为草稿，在演示软件中检查溢出并补充视觉层级。'],
    },
  },
  'zip-create': {
    reviewed,
    en: {
      overview:
        'Create ZIP packages selected files into one widely supported archive. Compression and assembly happen in browser memory, and the source files are not modified.',
      bestFor:
        'Bundling project files, grouping attachments, sharing a set of documents, and reducing the number of downloads.',
      input: 'Multiple files that should be included in one archive.',
      output: 'One downloadable .zip file containing the selected items.',
      limitation:
        'Already compressed photos, videos, PDFs, and Office files may shrink very little. Folder structure and password encryption are not added.',
      tips: [
        'Use clear filenames before creating the archive because recipients will see those names.',
        'Open the ZIP after download and confirm the expected file count before sharing it.',
      ],
    },
    zh: {
      overview: '创建 ZIP 会把所选文件打包成兼容性广泛的压缩包，压缩和组装在浏览器内存中完成，不会修改源文件。',
      bestFor: '打包项目文件、整理附件、分享一组文档和减少下载次数。',
      input: '需要放入同一压缩包的多个文件。',
      output: '一个包含所选项目的可下载 .zip 文件。',
      limitation: '已经压缩的照片、视频、PDF 和 Office 文件可能几乎不会变小；不会添加文件夹结构或密码加密。',
      tips: ['创建前整理文件名，因为接收者会看到这些名称。', '分享前打开下载的 ZIP，并核对预期文件数量。'],
    },
  },
  'zip-extract': {
    reviewed,
    en: {
      overview:
        'Extract ZIP reads an archive locally and prepares its entries for individual or grouped download. Inspecting the list first helps avoid saving files you do not need.',
      bestFor:
        'Opening lightweight ZIP downloads, retrieving selected assets, and inspecting an archive without installing software.',
      input: 'One standard .zip archive.',
      output: 'The readable files contained in the archive, available for download.',
      limitation:
        'Encrypted ZIPs, unsupported compression methods, RAR, and 7Z are not supported. Very large archives can exceed device memory.',
      tips: [
        'Do not open unexpected executable files from an untrusted archive.',
        'Keep the original ZIP until every extracted file has been checked.',
      ],
    },
    zh: {
      overview: '解压 ZIP 会在本地读取压缩包，并准备其中项目供单独或集中下载。先查看列表，可以避免保存不需要的文件。',
      bestFor: '打开轻量 ZIP 下载、提取指定素材，以及无需安装软件查看压缩包。',
      input: '一个标准 .zip 压缩包。',
      output: '压缩包中可读取的文件，可分别下载。',
      limitation: '不支持加密 ZIP、部分特殊压缩算法、RAR 和 7Z；超大压缩包可能超过设备内存。',
      tips: ['不要运行来源不可信压缩包中的意外可执行文件。', '确认每个解压文件之前保留原始 ZIP。'],
    },
  },
  'json-format': {
    reviewed,
    en: {
      overview:
        'The JSON formatter parses the input before producing readable indentation or a compact representation. A syntax error is reported instead of silently returning altered data.',
      bestFor:
        'Inspecting API responses, reviewing configuration files, finding syntax mistakes, and preparing compact payloads.',
      input: 'Valid JSON text representing any JSON value.',
      output: 'Formatted or minified JSON text that can be copied or downloaded.',
      limitation:
        'Formatting does not validate an application-specific schema and does not preserve insignificant original whitespace.',
      tips: [
        'Use formatted mode while debugging and minified mode only when smaller text is needed.',
        'Treat large integer identifiers carefully because some software may interpret them as numbers with limited precision.',
      ],
    },
    zh: {
      overview: 'JSON 格式化会先解析输入，再生成易读缩进或紧凑表示；遇到语法错误时会明确提示，而不是静默修改数据。',
      bestFor: '检查 API 响应、审阅配置文件、查找语法错误和准备紧凑请求内容。',
      input: '表示任意 JSON 值的有效 JSON 文本。',
      output: '可复制或下载的格式化或压缩 JSON 文本。',
      limitation: '格式化不会验证业务专用 Schema，也不会保留原始的无意义空白。',
      tips: [
        '调试时使用格式化模式，只在需要更小文本时使用压缩模式。',
        '谨慎处理很长的整数标识符，部分软件会以有限精度数字解释它们。',
      ],
    },
  },
  'csv-to-json': {
    reviewed,
    en: {
      overview:
        'CSV to JSON reads the first row as field names and converts each following row into an object. Quoted commas and escaped quotes are handled so common spreadsheet exports can be transformed reliably.',
      bestFor: 'Moving spreadsheet exports into scripts, prototypes, APIs, and data inspection workflows.',
      input: 'A UTF-8 CSV file with a header row.',
      output: 'A JSON array in which every CSV row becomes an object.',
      limitation:
        'CSV has no universal type system, so values are emitted as text and duplicate headers can be ambiguous.',
      tips: [
        'Give every column a unique, non-empty header before exporting the CSV.',
        'Check dates, leading zeros, and large identifiers after conversion because spreadsheet software may have changed them earlier.',
      ],
    },
    zh: {
      overview:
        'CSV 转 JSON 会把第一行作为字段名，并将之后每一行转换为对象，同时处理带引号的逗号和转义引号，适合常见表格导出。',
      bestFor: '把表格导出迁移到脚本、原型、API 和数据检查流程。',
      input: '一个带标题行的 UTF-8 CSV 文件。',
      output: '一个 JSON 数组，每个 CSV 数据行对应一个对象。',
      limitation: 'CSV 没有统一类型系统，因此值会作为文本输出，重复标题也可能产生歧义。',
      tips: [
        '导出 CSV 前为每列设置唯一且非空的标题。',
        '转换后检查日期、前导零和长标识符，因为表格软件可能已提前改变它们。',
      ],
    },
  },
  'json-to-csv': {
    reviewed,
    en: {
      overview:
        'JSON to CSV flattens an array of similarly shaped objects into rows and columns. Object keys become headers, while commas, quotes, and line breaks are escaped for CSV output.',
      bestFor: 'Opening API records in a spreadsheet, sharing simple tables, and preparing data for manual review.',
      input: 'A JSON array whose items are objects.',
      output: 'A UTF-8 CSV file with a combined header row.',
      limitation:
        'Nested objects and arrays cannot be represented as rich structures in CSV and may appear as serialized text.',
      tips: [
        'Normalize object keys before conversion so rows use a consistent set of columns.',
        'Open the result with UTF-8 import settings when the data contains multilingual text.',
      ],
    },
    zh: {
      overview: 'JSON 转 CSV 会把结构相近的对象数组展开为行列，对象键成为标题，逗号、引号和换行会按 CSV 规则转义。',
      bestFor: '在电子表格中打开 API 记录、分享简单表格和准备人工检查数据。',
      input: '元素为对象的 JSON 数组。',
      output: '一个带合并标题行的 UTF-8 CSV 文件。',
      limitation: '嵌套对象和数组无法在 CSV 中保留丰富结构，可能以序列化文本形式出现。',
      tips: ['转换前统一对象键，确保各行使用一致列集合。', '包含多语言文字时，应使用 UTF-8 导入设置打开结果。'],
    },
  },
  'file-checksum': {
    reviewed,
    en: {
      overview:
        'A checksum is a deterministic fingerprint calculated from file bytes. Comparing the result with a value published by a trusted source can reveal an incomplete or altered download.',
      bestFor:
        'Verifying software downloads, comparing file copies, checking transfers, and documenting file integrity.',
      input: 'Any local file plus SHA-256, SHA-384, or SHA-512.',
      output: 'A hexadecimal digest that can be copied and compared.',
      limitation:
        'A matching hash proves byte equality with the reference, not that the reference itself is trustworthy or safe.',
      tips: [
        'SHA-256 is the most commonly published option for ordinary download verification.',
        'Compare every character and obtain the expected hash from a trusted channel separate from the file when possible.',
      ],
    },
    zh: {
      overview:
        '校验值是根据文件字节计算出的确定性指纹。把结果与可信来源公布的数值比较，可以发现下载不完整或内容发生变化。',
      bestFor: '验证软件下载、比较文件副本、检查传输结果和记录文件完整性。',
      input: '任意本地文件，以及 SHA-256、SHA-384 或 SHA-512 算法。',
      output: '可复制和比较的十六进制摘要。',
      limitation: '哈希一致只能证明与参考值字节相同，不能证明参考文件本身可信或安全。',
      tips: [
        'SHA-256 是普通下载验证中最常见的公布格式。',
        '逐字符比较，并尽量从不同于文件下载地址的可信渠道获取预期哈希。',
      ],
    },
  },
  'file-to-base64': {
    reviewed,
    en: {
      overview:
        'File to Base64 converts binary bytes into text and includes a data URL prefix when the browser knows the media type. This is encoding for transport, not compression or encryption.',
      bestFor:
        'Small test assets, development debugging, email or API experiments, and embedding tiny files where a data URL is accepted.',
      input: 'Any file that fits comfortably in available browser memory.',
      output: 'Base64 text, usually as a data URL with a MIME type prefix.',
      limitation: 'Base64 is roughly one-third larger than the binary source and becomes inconvenient for large files.',
      tips: [
        'Avoid embedding large images or documents directly in HTML or JSON payloads.',
        'Do not treat Base64 as a security measure; anyone with the text can decode it.',
      ],
    },
    zh: {
      overview:
        '文件转 Base64 会把二进制字节编码为文本，并在浏览器识别媒体类型时加入 Data URL 前缀。它用于传输，不是压缩或加密。',
      bestFor: '小型测试素材、开发调试、邮件或 API 实验，以及允许 Data URL 的微小文件。',
      input: '能够放入当前浏览器内存的任意文件。',
      output: 'Base64 文本，通常包含 MIME 类型 Data URL 前缀。',
      limitation: 'Base64 通常比原始二进制大约多三分之一，大文件会很难处理。',
      tips: ['避免把大型图片或文档直接嵌入 HTML 或 JSON。', '不要把 Base64 当作安全措施，拿到文本的人都可以解码。'],
    },
  },
  'base64-to-file': {
    reviewed,
    en: {
      overview:
        'Base64 to file decodes text back into binary bytes and packages them as a browser download. A complete data URL can supply its own media type; raw Base64 uses the fallback type and filename you enter.',
      bestFor: 'Recovering test fixtures, saving API payloads, decoding embedded assets, and checking Base64 output.',
      input: 'Raw Base64 or a valid data URL, plus an output filename when needed.',
      output: 'One downloadable file containing the decoded bytes.',
      limitation:
        'Decoding cannot identify whether bytes form a safe or valid document. Incorrect MIME types or extensions can confuse other applications.',
      tips: [
        'Use the filename extension and MIME type expected by the source system.',
        'Scan or inspect decoded files from untrusted sources before opening them in another application.',
      ],
    },
    zh: {
      overview:
        'Base64 转文件会把文本还原为二进制字节并生成浏览器下载。完整 Data URL 可提供媒体类型，纯 Base64 则使用你输入的备用类型和文件名。',
      bestFor: '还原测试文件、保存 API 内容、解码嵌入素材和检查 Base64 输出。',
      input: '纯 Base64 或有效 Data URL，必要时还需输出文件名。',
      output: '一个包含解码字节的可下载文件。',
      limitation: '解码无法判断字节是否构成安全、有效的文档；错误的 MIME 类型或扩展名会让其他应用误判。',
      tips: ['使用来源系统预期的文件扩展名和 MIME 类型。', '打开不可信来源的解码文件前，应先进行安全扫描或内容检查。'],
    },
  },
}

export function getToolEditorial(id: ToolId, language: 'en' | 'zh') {
  return toolEditorial[id][language]
}
