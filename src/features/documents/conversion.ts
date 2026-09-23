import { parsePageSelection } from '../pdf/pdf-tools'
import { safeBaseName } from '../tools/result'
import type { ToolResult } from '../tools/types'

export type ConversionId = 'word-to-pdf' | 'pdf-to-word' | 'pdf-to-images' | 'pdf-to-text'
export type ConversionOptions = {
  pages: string
  password: string
  mode: 'text' | 'appearance'
  quality: 'standard' | 'high'
}
export type ConversionOutput = {
  result: ToolResult
  pageCount: number
  warnings: string[]
  preview?: Blob
}
export type ConversionProgress = { stage: 'reading' | 'rendering' | 'packing'; current: number; total: number }
type Progress = (value: ConversionProgress) => void
export const MAX_FILE_BYTES = 50 * 1024 * 1024
export const MAX_PAGES = 100

export function validateConversionFile(file: File, type: ConversionId) {
  if (!file.size) throw new Error('empty_file')
  if (file.size > MAX_FILE_BYTES) throw new Error('file_too_large')
  if (type === 'word-to-pdf' && /\.doc$/i.test(file.name)) throw new Error('legacy_doc')
  if (!(type === 'word-to-pdf' ? /\.docx$/i : /\.pdf$/i).test(file.name)) throw new Error('wrong_format')
}

function check(signal: AbortSignal) {
  if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')
}
async function breathe(signal: AbortSignal) {
  await new Promise((resolve) => setTimeout(resolve, 0))
  check(signal)
}
function blobFromCanvas(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('render_failed'))), 'image/jpeg', 0.9),
  )
}

export type TextFragment = { str: string; transform: number[]; width: number; height: number; hasEOL?: boolean }
/** Keep PDF content-stream order (including RTL); insert spaces only where the geometry shows a gap. */
export function textLines(items: TextFragment[]): string[] {
  const lines: string[] = []
  let line = ''
  let previous: TextFragment | undefined
  for (const item of items) {
    const newLine =
      previous &&
      (previous.hasEOL || Math.abs(item.transform[5] - previous.transform[5]) > Math.max(2, item.height * 0.5))
    if (newLine && line.trim()) {
      lines.push(line.trim())
      line = ''
    }
    const gap = previous ? item.transform[4] - (previous.transform[4] + previous.width) : 0
    if (line && gap > Math.max(1, item.height * 0.15) && !/\s$/.test(line) && !/^\s/.test(item.str)) line += ' '
    line += item.str
    previous = item
  }
  if (line.trim()) lines.push(line.trim())
  return lines
}

async function convertPdf(
  file: File,
  type: ConversionId,
  options: ConversionOptions,
  signal: AbortSignal,
  progress: Progress,
): Promise<ConversionOutput> {
  const pdfjs = await import('pdfjs-dist')
  const { default: workerUrl } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl
  check(signal)
  const data = new Uint8Array(await file.arrayBuffer())
  if (!new TextDecoder().decode(data.slice(0, 1024)).includes('%PDF-')) throw new Error('invalid_pdf')
  const task = pdfjs.getDocument({
    data,
    password: options.password || undefined,
    isEvalSupported: false,
    cMapUrl: '/pdfjs/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/pdfjs/standard_fonts/',
    wasmUrl: '/pdfjs/wasm/',
  })
  const cancel = () => {
    void task.destroy().catch(() => {})
  }
  signal.addEventListener('abort', cancel, { once: true })
  try {
    const pdf = await task.promise
    check(signal)
    const selected = parsePageSelection(options.pages, pdf.numPages)
    if (selected.length > MAX_PAGES) throw new Error('too_many_pages')
    const warnings: string[] = []
    const docx = type === 'pdf-to-word' ? await import('docx') : undefined
    const zip = type === 'pdf-to-images' ? new (await import('jszip')).default() : undefined
    const sections: import('docx').ISectionOptions[] = []
    const textPages: string[] = []
    let preview: Blob | undefined
    let hasText = false
    for (const [position, index] of selected.entries()) {
      await breathe(signal)
      progress({ stage: 'rendering', current: position, total: selected.length })
      const page = await pdf.getPage(index + 1)
      const viewport = page.getViewport({ scale: 1 })
      const needText = type === 'pdf-to-text' || (type === 'pdf-to-word' && options.mode === 'text')
      const content = needText ? await page.getTextContent() : undefined
      const lines = content
        ? textLines(
            content.items.filter(
              (item): item is TextFragment & { dir: string; fontName: string; hasEOL: boolean } => 'str' in item,
            ),
          )
        : []
      if (lines.length) hasText = true
      const scanned = needText && !lines.length
      if (scanned) warnings.push(`scan:${index + 1}`)
      const needImage =
        type === 'pdf-to-images' || (type === 'pdf-to-word' && (options.mode === 'appearance' || scanned))
      let pageImage: Blob | undefined
      if (needImage || (!preview && type !== 'pdf-to-text')) {
        const scale = Math.min(
          options.quality === 'high' ? 2 : 1.3,
          Math.sqrt(4_000_000 / (viewport.width * viewport.height)),
          8192 / Math.max(viewport.width, viewport.height),
        )
        const renderViewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = Math.ceil(renderViewport.width)
        canvas.height = Math.ceil(renderViewport.height)
        try {
          const rendering = page.render({ canvas, viewport: renderViewport, background: '#ffffff' })
          const abortRender = () => rendering.cancel()
          signal.addEventListener('abort', abortRender, { once: true })
          try {
            await rendering.promise
          } finally {
            signal.removeEventListener('abort', abortRender)
          }
          pageImage = await blobFromCanvas(canvas)
          preview ??= pageImage
        } finally {
          canvas.width = 0
          canvas.height = 0
        }
      }
      if (zip && pageImage) zip.file(`page-${String(index + 1).padStart(3, '0')}.jpg`, await pageImage.arrayBuffer())
      if (type === 'pdf-to-text') textPages.push(`--- Page ${index + 1} ---\n${lines.join('\n')}`)
      if (docx) {
        const imageMode = options.mode === 'appearance' || scanned
        const children: import('docx').Paragraph[] = []
        if (imageMode && pageImage) {
          children.push(
            new docx.Paragraph({
              spacing: { before: 0, after: 0 },
              children: [
                new docx.ImageRun({
                  type: 'jpg',
                  data: await pageImage.arrayBuffer(),
                  transformation: {
                    width: ((viewport.width * 96) / 72) * 0.97,
                    height: ((viewport.height * 96) / 72) * 0.97,
                  },
                }),
              ],
            }),
          )
        } else {
          for (const line of lines)
            children.push(
              new docx.Paragraph({
                spacing: { after: 80 },
                children: [new docx.TextRun({ text: line, size: 22, font: 'Arial' })],
              }),
            )
        }
        sections.push({
          properties: {
            type: docx.SectionType.NEXT_PAGE,
            page: {
              size: { width: Math.round(viewport.width * 20), height: Math.round(viewport.height * 20) },
              margin: imageMode
                ? { top: 0, bottom: 0, left: 0, right: 0 }
                : { top: 720, bottom: 720, left: 720, right: 720 },
            },
          },
          children,
        })
      }
      page.cleanup()
      progress({ stage: 'rendering', current: position + 1, total: selected.length })
    }
    await breathe(signal)
    progress({ stage: 'packing', current: selected.length, total: selected.length })
    const name = safeBaseName(file.name)
    let result: ToolResult
    if (docx) {
      const blob = await docx.Packer.toBlob(new docx.Document({ creator: 'FileTools', sections }))
      result = { blob, filename: `${name}.docx`, mimeType: blob.type }
    } else if (zip) {
      const blob = await zip.generateAsync({ type: 'blob' })
      result = { blob, filename: `${name}-images.zip`, mimeType: 'application/zip' }
    } else {
      if (!hasText) throw new Error('no_text')
      result = { text: textPages.join('\n\n'), filename: `${name}.txt`, mimeType: 'text/plain;charset=utf-8' }
    }
    check(signal)
    return { result, pageCount: selected.length, warnings, preview }
  } finally {
    signal.removeEventListener('abort', cancel)
    await task.destroy()
  }
}

/** Find page breaks in whitespace where possible, so overflow paragraphs are not sliced through a text line. */
export function pageSlices(height: number, pageHeight: number, lines: Array<{ top: number; bottom: number }>) {
  const slices: Array<{ y: number; height: number }> = []
  let y = 0
  while (y < height - 1) {
    let end = Math.min(height, y + pageHeight)
    if (end < height) {
      for (const line of lines) {
        if (line.top < end && line.bottom > end && line.top > y + pageHeight * 0.6) end = line.top
      }
    }
    slices.push({ y, height: end - y })
    y = end
    if (slices.length > MAX_PAGES) throw new Error('too_many_pages')
  }
  return slices
}

async function convertWord(
  file: File,
  options: ConversionOptions,
  signal: AbortSignal,
  progress: Progress,
): Promise<ConversionOutput> {
  const [{ renderAsync }, { default: html2canvas }, { PDFDocument }, { default: JSZip }] = await Promise.all([
    import('docx-preview'),
    import('html2canvas-pro'),
    import('pdf-lib'),
    import('jszip'),
  ])
  check(signal)
  const zip = await JSZip.loadAsync(await file.arrayBuffer()).catch(() => {
    throw new Error('invalid_docx')
  })
  if (!zip.file('word/document.xml')) throw new Error('invalid_docx')
  // No external relationships (remote pictures, templates, hyperlinks) are resolved during local conversion.
  for (const entry of Object.values(zip.files).filter((entry) => /\.rels$/.test(entry.name))) {
    const xml = new DOMParser().parseFromString(await entry.async('string'), 'application/xml')
    for (const relation of Array.from(xml.getElementsByTagNameNS('*', 'Relationship'))) {
      if (relation.getAttribute('TargetMode') === 'External') relation.remove()
    }
    zip.file(entry.name, new XMLSerializer().serializeToString(xml))
  }
  const frame = document.createElement('iframe')
  frame.title = 'Local document renderer'
  frame.setAttribute('aria-hidden', 'true')
  frame.tabIndex = -1
  frame.sandbox.add('allow-same-origin')
  frame.style.cssText = 'position:fixed;left:-12000px;top:0;width:1200px;height:900px;border:0;pointer-events:none;'
  frame.srcdoc =
    '<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data: blob:; font-src data: blob:; style-src \'unsafe-inline\'"><style>body{margin:0;background:white}section.docx{box-shadow:none!important;margin:0!important;overflow:visible!important}</style></head><body><div id="document"></div></body></html>'
  const loaded = new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('render_failed')), 15000)
    frame.onload = () => {
      clearTimeout(timeout)
      resolve()
    }
  })
  document.body.append(frame)
  try {
    await loaded
    check(signal)
    const rendered = frame.contentDocument!
    const container = rendered.getElementById('document')!
    await renderAsync(await zip.generateAsync({ type: 'uint8array' }), container, rendered.head, {
      inWrapper: false,
      ignoreLastRenderedPageBreak: false,
      useBase64URL: true,
      renderAltChunks: false,
      renderComments: false,
      renderChanges: false,
    })
    await rendered.fonts.ready
    await Promise.all(Array.from(container.querySelectorAll('img')).map((image) => image.decode().catch(() => {})))
    check(signal)
    const pages = Array.from(container.querySelectorAll<HTMLElement>('section.docx'))
    if (!pages.length) throw new Error('invalid_docx')
    const pdf = await PDFDocument.create()
    let preview: Blob | undefined
    let total = 0
    const jobs = pages.flatMap((page) => {
      const rect = page.getBoundingClientRect()
      const pageHeight = parseFloat(page.style.minHeight)
        ? parseFloat(frame.contentWindow!.getComputedStyle(page).minHeight)
        : 1123
      const height = Math.max(page.scrollHeight, rect.height)
      const lines: Array<{ top: number; bottom: number }> = []
      const walker = rendered.createTreeWalker(page, NodeFilter.SHOW_TEXT)
      while (walker.nextNode()) {
        const range = rendered.createRange()
        range.selectNodeContents(walker.currentNode)
        for (const line of Array.from(range.getClientRects()))
          lines.push({ top: line.top - rect.top, bottom: line.bottom - rect.top })
      }
      const slices = pageSlices(height, pageHeight, lines)
      total += slices.length
      if (total > MAX_PAGES) throw new Error('too_many_pages')
      return slices.map((slice) => ({ page, width: rect.width, pageHeight, ...slice }))
    })
    for (const [index, job] of jobs.entries()) {
      await breathe(signal)
      progress({ stage: 'rendering', current: index, total })
      const scale = Math.min(options.quality === 'high' ? 2 : 1.3, Math.sqrt(4_000_000 / (job.width * job.height)))
      const canvas = await html2canvas(job.page, {
        backgroundColor: '#ffffff',
        scale,
        width: job.width,
        height: job.height,
        y: job.y,
        logging: false,
        useCORS: false,
        allowTaint: false,
        windowWidth: 1200,
      })
      try {
        check(signal)
        const blob = await blobFromCanvas(canvas)
        preview ??= blob
        const image = await pdf.embedJpg(await blob.arrayBuffer())
        const outputPage = pdf.addPage([job.width * 0.75, job.pageHeight * 0.75])
        outputPage.drawImage(image, {
          x: 0,
          y: (job.pageHeight - job.height) * 0.75,
          width: job.width * 0.75,
          height: job.height * 0.75,
        })
      } finally {
        canvas.width = 0
        canvas.height = 0
      }
      progress({ stage: 'rendering', current: index + 1, total })
    }
    progress({ stage: 'packing', current: total, total })
    const bytes = await pdf.save()
    check(signal)
    return {
      result: {
        blob: new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }),
        filename: `${safeBaseName(file.name)}.pdf`,
        mimeType: 'application/pdf',
      },
      pageCount: total,
      warnings: [],
      preview,
    }
  } finally {
    frame.remove()
  }
}

export async function convertDocument(
  file: File,
  type: ConversionId,
  options: ConversionOptions,
  signal: AbortSignal,
  progress: Progress,
): Promise<ConversionOutput> {
  validateConversionFile(file, type)
  check(signal)
  progress({ stage: 'reading', current: 0, total: 0 })
  return type === 'word-to-pdf'
    ? convertWord(file, options, signal, progress)
    : convertPdf(file, type, options, signal, progress)
}
