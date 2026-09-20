export type GuideDetailLocale = {
  bestFor: string
  input: string
  output: string
  checklist: string[]
  questions: Array<{ question: string; answer: string }>
}

export type GuideDetails = {
  reviewed: string
  en: GuideDetailLocale
  zh: GuideDetailLocale
}

export const guideDetails: Record<string, GuideDetails> = {
  'compress-images-without-upload': {
    reviewed: '2026-09-09',
    en: {
      bestFor: 'Email attachments, web images, forms, and social posts that have a file-size limit.',
      input: 'JPG, PNG, or WebP images',
      output: 'JPG, PNG, or WebP images with adjustable quality and dimensions',
      checklist: [
        'Keep an untouched copy of the original image.',
        'Choose the final image dimensions before adjusting quality.',
        'Inspect text, faces, gradients, and transparent edges after compression.',
      ],
      questions: [
        {
          question: 'Why did a PNG become larger after compression?',
          answer:
            'PNG is lossless and works best for graphics, screenshots, and transparency. A detailed photo may be much smaller as JPG or WebP, while re-encoding a well-optimized PNG can add bytes instead of removing them. FileTools keeps the original when the generated result is not smaller.',
        },
        {
          question: 'What quality setting should I start with?',
          answer:
            'For photographs, start around 75–85% quality and compare the preview at normal viewing size. Logos, diagrams, and screenshots with small text often need a higher setting or PNG output to keep edges readable.',
        },
      ],
    },
    zh: {
      bestFor: '有文件大小限制的邮件附件、网页图片、在线表单和社交平台图片。',
      input: 'JPG、PNG 或 WebP 图片',
      output: '可调整质量和尺寸的 JPG、PNG 或 WebP 图片',
      checklist: [
        '保留一份未经处理的原图。',
        '先确定最终尺寸，再调整图片质量。',
        '压缩后重点检查文字、人脸、渐变和透明边缘。',
      ],
      questions: [
        {
          question: '为什么 PNG 压缩后反而更大？',
          answer:
            'PNG 是无损格式，更适合图形、截图和透明背景。细节丰富的照片改用 JPG 或 WebP 往往更小，而已经优化过的 PNG 重新编码后可能增加体积。FileTools 在生成文件没有变小时会保留原文件。',
        },
        {
          question: '图片质量应该从多少开始？',
          answer:
            '照片可以从 75%–85% 开始，并在正常显示尺寸下比较效果。包含小字的标志、图表和截图通常需要更高质量，或者继续使用 PNG 来保持边缘清晰。',
        },
      ],
    },
  },
  'merge-pdf-files': {
    reviewed: '2026-09-09',
    en: {
      bestFor: 'Combining scans, invoices, application pages, or chapters into one ordered document.',
      input: 'Two or more standard PDF files',
      output: 'One merged PDF in the selected order',
      checklist: [
        'Open every source PDF and confirm it is not corrupted or password protected.',
        'Arrange files in the exact reading order before merging.',
        'Open the downloaded PDF and inspect the first, middle, and last pages.',
      ],
      questions: [
        {
          question: 'Will bookmarks and form fields remain interactive?',
          answer:
            'Page appearance is usually preserved, but document-level bookmarks, signatures, forms, and advanced annotations may not behave exactly like the originals. Keep the source files and check any interactive elements before using the merged document officially.',
        },
        {
          question: 'Why does a large merge stop in the browser?',
          answer:
            'Browser-local processing uses your device memory. A long scan with high-resolution images can require several times its file size while being processed. Merge fewer documents at a time, close unused tabs, or use a desktop device with more available memory.',
        },
      ],
    },
    zh: {
      bestFor: '把扫描件、发票、申请材料或多个章节按顺序合并为一份文档。',
      input: '两个或更多普通 PDF 文件',
      output: '按所选顺序生成的一份合并 PDF',
      checklist: [
        '逐个打开源 PDF，确认文件未损坏且没有密码。',
        '合并前按最终阅读顺序排列文件。',
        '下载后检查第一页、中间页和最后一页。',
      ],
      questions: [
        {
          question: '书签和表单字段还能正常使用吗？',
          answer:
            '页面外观通常能够保留，但文档级书签、签名、表单和高级批注不一定与原文件完全一致。请保留源文件，并在正式使用前检查所有交互元素。',
        },
        {
          question: '为什么合并大文件时浏览器会停止？',
          answer:
            '本地处理会占用设备内存。包含高清扫描图片的长 PDF 在处理时可能需要数倍于文件体积的内存。可以分批合并、关闭不需要的标签页，或改用内存更充足的电脑。',
        },
      ],
    },
  },
  'convert-images-to-pdf': {
    reviewed: '2026-09-09',
    en: {
      bestFor: 'Turning photographed notes, receipts, artwork, or scanned pages into one shareable document.',
      input: 'JPG, PNG, or WebP images',
      output: 'One PDF with one image placed on each page',
      checklist: [
        'Rotate images upright and crop unwanted borders first.',
        'Rename or select images in the intended page order.',
        'Check that small text remains readable in the final PDF.',
      ],
      questions: [
        {
          question: 'Why are there margins around an image?',
          answer:
            'The tool fits each image onto a PDF page while preserving its aspect ratio. Portrait and landscape images therefore use different amounts of page space. Crop images to a consistent ratio before conversion when edge-to-edge alignment matters.',
        },
        {
          question: 'Can the generated PDF be searched?',
          answer:
            'No optical character recognition is performed. Text photographed inside an image remains part of that image rather than becoming selectable PDF text. Use OCR software afterward when searchable text is required.',
        },
      ],
    },
    zh: {
      bestFor: '把拍摄的笔记、收据、作品或扫描页整理成一份便于分享的文档。',
      input: 'JPG、PNG 或 WebP 图片',
      output: '每张图片占一页的一份 PDF',
      checklist: [
        '先把图片旋转到正确方向并裁掉无关边缘。',
        '按最终页码顺序重命名或选择图片。',
        '检查生成 PDF 中的小字是否仍然清晰。',
      ],
      questions: [
        {
          question: '为什么图片周围会出现留白？',
          answer:
            '工具会保持图片比例并将其放入 PDF 页面，因此横图和竖图占用的页面空间不同。如果需要整齐的满版效果，应在转换前把图片裁成统一比例。',
        },
        {
          question: '生成的 PDF 可以搜索文字吗？',
          answer:
            '当前工具不执行文字识别。照片中的文字仍是图片的一部分，不能作为 PDF 文本选择或搜索。如果需要可搜索文字，可以在生成后使用 OCR 软件。',
        },
      ],
    },
  },
  'word-to-html-basics': {
    reviewed: '2026-09-09',
    en: {
      bestFor: 'Reusing the readable structure of a DOCX draft in a website, CMS, or email editor.',
      input: 'A DOCX document',
      output: 'Editable HTML containing supported headings, paragraphs, lists, links, and images',
      checklist: [
        'Use Word heading styles instead of manually enlarged text.',
        'Remove tracked changes and resolve comments before conversion.',
        'Review links, lists, tables, and image placement in the target editor.',
      ],
      questions: [
        {
          question: 'Why does the HTML not look exactly like Word?',
          answer:
            'Word describes printed pages, while HTML describes document structure that adapts to screen size. The converter prioritizes headings, paragraphs, lists, tables, and images instead of reproducing page margins, floating objects, headers, or exact pagination.',
        },
        {
          question: 'Is the result ready to publish without review?',
          answer:
            'Treat the result as a clean starting point. Paste it into your CMS, apply the site stylesheet, verify heading order and links, add image alternative text, and preview it on both desktop and mobile before publishing.',
        },
      ],
    },
    zh: {
      bestFor: '把 DOCX 草稿中的可读结构复用到网站、内容管理系统或邮件编辑器。',
      input: 'DOCX 文档',
      output: '包含受支持标题、段落、列表、链接和图片的可编辑 HTML',
      checklist: [
        '使用 Word 标题样式，不要只手动放大文字。',
        '转换前接受或拒绝修订，并处理完批注。',
        '在目标编辑器中检查链接、列表、表格和图片位置。',
      ],
      questions: [
        {
          question: '为什么 HTML 和 Word 看起来不完全一样？',
          answer:
            'Word 描述的是打印页面，HTML 描述的是会随屏幕调整的文档结构。转换器优先保留标题、段落、列表、表格和图片，不会精确复制页边距、浮动对象、页眉页脚和分页。',
        },
        {
          question: '结果可以不检查直接发布吗？',
          answer:
            '建议把结果作为干净的起点。粘贴到内容管理系统后，应应用网站样式、检查标题顺序和链接、补充图片替代文本，并在电脑和手机上预览后再发布。',
        },
      ],
    },
  },
  'make-a-presentation-from-images': {
    reviewed: '2026-09-09',
    en: {
      bestFor: 'Photo portfolios, mood boards, product galleries, and simple visual presentations.',
      input: 'JPG, PNG, or WebP images',
      output: 'An editable widescreen PPTX with one image per slide',
      checklist: [
        'Use images with a consistent orientation and sufficient resolution.',
        'Put the files in presentation order before creating the deck.',
        'Open the PPTX and add titles, captions, and accessibility descriptions where needed.',
      ],
      questions: [
        {
          question: 'Why is part of an image cropped?',
          answer:
            'The presentation uses a widescreen slide ratio. Images with another ratio may be fitted with empty space or cropped depending on the layout. Preparing all images at 16:9 gives the most consistent result.',
        },
        {
          question: 'Can I edit the image after downloading?',
          answer:
            'The images are placed as slide objects, so PowerPoint and compatible editors can move, resize, crop, or replace them. The pixels inside each image are not converted into separate editable shapes.',
        },
      ],
    },
    zh: {
      bestFor: '照片作品集、灵感板、产品图册和以图片为主的简单演示。',
      input: 'JPG、PNG 或 WebP 图片',
      output: '每页一张图片的可编辑宽屏 PPTX',
      checklist: [
        '使用方向一致、分辨率足够的图片。',
        '生成前按演示顺序排列文件。',
        '下载后在 PPTX 中补充标题、说明和必要的无障碍描述。',
      ],
      questions: [
        {
          question: '为什么图片的一部分被裁掉？',
          answer:
            '演示文稿使用宽屏页面比例。比例不同的图片可能出现留白或裁切。提前把所有图片整理为 16:9，通常能获得最一致的效果。',
        },
        {
          question: '下载后还能编辑图片吗？',
          answer:
            '图片会作为幻灯片对象放置，因此可以在 PowerPoint 或兼容软件中移动、缩放、裁剪和替换；但图片内部像素不会变成独立的可编辑形状。',
        },
      ],
    },
  },
  'split-pdf-into-separate-pages': {
    reviewed: '2026-09-09',
    en: {
      bestFor: 'Separating scanned forms, receipts, certificates, or records that must be filed one page at a time.',
      input: 'One standard PDF file',
      output: 'A ZIP containing one single-page PDF for every source page',
      checklist: [
        'Confirm the PDF opens without a password prompt.',
        'Check the page count before processing.',
        'Open several files from the downloaded ZIP and rename them for their purpose.',
      ],
      questions: [
        {
          question: 'Why are the results downloaded as a ZIP?',
          answer:
            'A long PDF can produce dozens of separate files. Packaging them in one ZIP avoids many browser download prompts and keeps the original page order together. Extract the ZIP on your device to access each page PDF.',
        },
        {
          question: 'Should I split or extract pages?',
          answer:
            'Split when every page needs its own file. Extract when you only need selected pages combined into one smaller PDF. Choosing the right operation avoids extra renaming and merging afterward.',
        },
      ],
    },
    zh: {
      bestFor: '把需要逐页归档的扫描表单、收据、证书或记录拆成独立文件。',
      input: '一份普通 PDF 文件',
      output: '包含每个单页 PDF 的 ZIP 压缩包',
      checklist: [
        '确认 PDF 打开时不会要求密码。',
        '处理前核对文件页数。',
        '从下载的 ZIP 中打开几页检查，并按用途重命名。',
      ],
      questions: [
        {
          question: '为什么结果会以 ZIP 下载？',
          answer:
            '一份长 PDF 可能生成几十个独立文件。打包成 ZIP 可以避免浏览器连续弹出下载确认，也能保持原页码顺序。请在设备上解压后查看每个单页 PDF。',
        },
        {
          question: '应该拆分还是提取页面？',
          answer:
            '每一页都要成为独立文件时使用拆分；只需要挑选若干页并合并成一个较小 PDF 时使用提取。选对操作可以减少之后重新命名和合并的工作。',
        },
      ],
    },
  },
  'convert-csv-to-json': {
    reviewed: '2026-09-09',
    en: {
      bestFor: 'Preparing spreadsheet exports for APIs, scripts, prototypes, and configuration files.',
      input: 'A UTF-8 CSV file with a header row',
      output: 'A JSON array whose object keys come from the CSV headers',
      checklist: [
        'Confirm the first row contains unique column names.',
        'Check quoted fields that contain commas or line breaks.',
        'Validate numbers, dates, empty cells, and leading zeros in the JSON result.',
      ],
      questions: [
        {
          question: 'Why do leading zeros disappear in another application?',
          answer:
            'Values such as postal codes and account identifiers should remain strings. FileTools preserves CSV values as text, but a later application may automatically convert them to numbers. Define a schema or explicitly cast those fields as strings when importing the JSON.',
        },
        {
          question: 'What happens when a row has fewer columns?',
          answer:
            'Missing values are represented as empty fields according to the available headers. Inspect inconsistent rows before relying on the output, because a misplaced delimiter can shift every value that follows it.',
        },
      ],
    },
    zh: {
      bestFor: '把电子表格导出数据用于接口、脚本、原型和配置文件。',
      input: '包含表头行的 UTF-8 CSV 文件',
      output: '以 CSV 表头作为对象键的 JSON 数组',
      checklist: [
        '确认第一行包含不重复的列名。',
        '检查含逗号或换行的字段是否正确使用引号。',
        '核对 JSON 中的数字、日期、空单元格和前导零。',
      ],
      questions: [
        {
          question: '为什么前导零在其他应用中消失了？',
          answer:
            '邮政编码、账号等值应当作为字符串。FileTools 会把 CSV 值保留为文本，但后续应用可能自动转成数字。导入 JSON 时应定义数据结构，或明确把这些字段转换为字符串。',
        },
        {
          question: '某一行列数不足时会怎样？',
          answer:
            '缺失值会根据已有表头表示为空字段。正式使用前应检查列数不一致的行，因为一个位置错误的分隔符可能导致后续所有值错位。',
        },
      ],
    },
  },
  'create-a-zip-file-in-browser': {
    reviewed: '2026-09-09',
    en: {
      bestFor: 'Bundling attachments, assignments, project assets, or groups of related files for one download.',
      input: 'Multiple files of any common type',
      output: 'One standard ZIP archive',
      checklist: [
        'Remove duplicate and temporary files before creating the archive.',
        'Use readable filenames that explain what each item contains.',
        'Open the finished ZIP and verify the expected file count.',
      ],
      questions: [
        {
          question: 'Why did the ZIP barely reduce the total size?',
          answer:
            'JPG, MP4, PDF, DOCX, and many other formats are already compressed. ZIP may not shrink them much, but it still provides the practical benefit of packaging several files into one organized download.',
        },
        {
          question: 'Does this tool add a password to the ZIP?',
          answer:
            'No. The current browser tool creates a standard unencrypted ZIP. Do not use it as protection for confidential material; choose a trusted encryption workflow when a password or strong encryption is required.',
        },
      ],
    },
    zh: {
      bestFor: '把附件、作业、项目素材或一组相关文件整理为一次下载。',
      input: '多个常见类型的文件',
      output: '一个标准 ZIP 压缩包',
      checklist: [
        '创建前移除重复文件和临时文件。',
        '使用能够说明内容的易读文件名。',
        '打开生成的 ZIP 并核对文件数量。',
      ],
      questions: [
        {
          question: '为什么 ZIP 几乎没有减小总体积？',
          answer:
            'JPG、MP4、PDF、DOCX 等格式本身已经压缩，加入 ZIP 后不一定明显变小。不过 ZIP 仍能把多个文件整理为一次下载，便于发送和归档。',
        },
        {
          question: '这个工具能给 ZIP 添加密码吗？',
          answer:
            '不能。当前浏览器工具生成的是普通未加密 ZIP，不能用于保护机密材料。如果需要密码或强加密，请选择可信的加密工具和流程。',
        },
      ],
    },
  },
  'convert-text-to-word-docx': {
    reviewed: '2026-09-09',
    en: {
      bestFor: 'Turning notes, drafts, meeting records, or copied plain text into an editable Word file.',
      input: 'Plain text with paragraph breaks',
      output: 'A simple editable DOCX document',
      checklist: [
        'Separate headings and paragraphs with clear line breaks.',
        'Remove copied navigation, repeated whitespace, or unrelated footer text.',
        'Open the DOCX and apply document styles before final delivery.',
      ],
      questions: [
        {
          question: 'Will Markdown become formatted Word content?',
          answer:
            'No. Markdown symbols are treated as ordinary text in the current tool. The generated DOCX is intentionally simple; apply headings, lists, emphasis, page numbers, and other layout in Word or a compatible editor afterward.',
        },
        {
          question: 'Why use DOCX instead of a TXT file?',
          answer:
            'DOCX is easier to continue formatting, comment on, and share in office workflows. TXT is smaller and more universal, but it cannot store page layout or rich formatting added later.',
        },
      ],
    },
    zh: {
      bestFor: '把笔记、草稿、会议记录或复制的纯文本整理成可编辑 Word 文件。',
      input: '带有段落换行的纯文本',
      output: '一份简单、可编辑的 DOCX 文档',
      checklist: [
        '用清晰换行分隔标题和段落。',
        '移除复制来的导航、重复空格和无关页脚。',
        '下载后打开 DOCX，并在最终交付前应用文档样式。',
      ],
      questions: [
        {
          question: 'Markdown 会自动变成 Word 格式吗？',
          answer:
            '不会。当前工具会把 Markdown 符号当作普通文字。生成的 DOCX 刻意保持简单，可以在 Word 或兼容软件中继续添加标题、列表、强调、页码和其他排版。',
        },
        {
          question: '为什么不用 TXT 文件？',
          answer:
            'DOCX 更适合继续排版、批注和在办公流程中分享。TXT 更小、更通用，但不能保存之后添加的页面布局和富文本格式。',
        },
      ],
    },
  },
}

export function getGuideDetails(slug: string | undefined) {
  return slug ? guideDetails[slug] : undefined
}
