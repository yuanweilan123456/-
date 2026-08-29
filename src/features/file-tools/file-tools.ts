export type FileToolType = 'pdf-merge' | 'pdf-split' | 'images-to-pdf' | 'docx-to-html' | 'images-to-pptx'

export type ToolResult = { blob?: Blob; text?: string; filename: string; mimeType: string }

function downloadName(name: string, extension: string) {
  const base =
    name
      .replace(/\.[^/.]+$/, '')
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-')
      .trim() || 'file'
  return `${base}.${extension}`
}

function bytesToBlob(bytes: Uint8Array, mimeType: string) {
  return new Blob([bytes.buffer as ArrayBuffer], { type: mimeType })
}

export async function mergePdfs(files: File[]): Promise<ToolResult> {
  const { PDFDocument } = await import('pdf-lib')
  const output = await PDFDocument.create()
  for (const file of files) {
    const source = await PDFDocument.load(await file.arrayBuffer())
    const pages = await output.copyPages(source, source.getPageIndices())
    pages.forEach((page) => output.addPage(page))
  }
  if (output.getPageCount() === 0) throw new Error('empty_pdf')
  return {
    blob: bytesToBlob(await output.save(), 'application/pdf'),
    filename: 'merged-document.pdf',
    mimeType: 'application/pdf',
  }
}

export async function splitPdf(file: File): Promise<ToolResult[]> {
  const { PDFDocument } = await import('pdf-lib')
  const source = await PDFDocument.load(await file.arrayBuffer())
  const results: ToolResult[] = []
  for (const pageIndex of source.getPageIndices()) {
    const output = await PDFDocument.create()
    const [page] = await output.copyPages(source, [pageIndex])
    output.addPage(page)
    results.push({
      blob: bytesToBlob(await output.save(), 'application/pdf'),
      filename: downloadName(file.name, `page-${pageIndex + 1}.pdf`),
      mimeType: 'application/pdf',
    })
  }
  return results
}

function loadImage(file: File): Promise<{ image: HTMLImageElement; url: string }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => resolve({ image, url })
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('decode_failed'))
    }
    image.src = url
  })
}

async function getPngBytes(file: File): Promise<{ bytes: Uint8Array; width: number; height: number }> {
  const { image, url } = await loadImage(file)
  try {
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('canvas_unavailable')
    context.drawImage(image, 0, 0)
    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('encode_failed'))), 'image/png'),
    )
    return { bytes: new Uint8Array(await blob.arrayBuffer()), width: image.naturalWidth, height: image.naturalHeight }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function imagesToPdf(files: File[]): Promise<ToolResult> {
  const { PDFDocument } = await import('pdf-lib')
  const output = await PDFDocument.create()
  for (const file of files) {
    const png = await getPngBytes(file)
    const image = await output.embedPng(png.bytes)
    const page = output.addPage([png.width, png.height])
    page.drawImage(image, { x: 0, y: 0, width: png.width, height: png.height })
  }
  return {
    blob: bytesToBlob(await output.save(), 'application/pdf'),
    filename: 'images.pdf',
    mimeType: 'application/pdf',
  }
}

async function toDataUrl(file: File): Promise<{ dataUrl: string; width: number; height: number }> {
  const { image, url } = await loadImage(file)
  try {
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const context = canvas.getContext('2d')
    if (!context) throw new Error('canvas_unavailable')
    context.drawImage(image, 0, 0)
    return { dataUrl: canvas.toDataURL('image/jpeg', 0.94), width: image.naturalWidth, height: image.naturalHeight }
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function imagesToPptx(files: File[]): Promise<ToolResult> {
  const { default: PptxGenJS } = await import('pptxgenjs')
  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'PixelForge Image Tools'
  for (const file of files) {
    const image = await toDataUrl(file)
    const slide = pptx.addSlide()
    const ratio = image.width / image.height
    const slideRatio = 13.333 / 7.5
    const width = ratio > slideRatio ? 13.333 : 7.5 * ratio
    const height = ratio > slideRatio ? 13.333 / ratio : 7.5
    slide.background = { color: 'FFFFFF' }
    slide.addImage({ data: image.dataUrl, x: (13.333 - width) / 2, y: (7.5 - height) / 2, w: width, h: height })
  }
  const blob = (await pptx.write({ outputType: 'blob' })) as Blob
  return {
    blob,
    filename: 'images-presentation.pptx',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  }
}

export async function docxToHtml(file: File): Promise<ToolResult> {
  const { default: mammoth } = await import('mammoth/mammoth.browser.js')
  const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() })
  return { text: result.value, filename: downloadName(file.name, 'html'), mimeType: 'text/html' }
}

export function textResultToBlob(result: ToolResult) {
  if (!result.text) return undefined
  return new Blob(
    [
      `<!doctype html><html><head><meta charset="utf-8"><title>PixelForge document</title></head><body>${result.text}</body></html>`,
    ],
    { type: result.mimeType },
  )
}
