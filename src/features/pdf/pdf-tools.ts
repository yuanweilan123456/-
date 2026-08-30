import { bytesToBlob, downloadName } from '../tools/result'
import type { ToolResult } from '../tools/types'

function normalizedPageIndices(selection: string, pageCount: number) {
  if (!selection.trim() || selection.trim().toLowerCase() === 'all') {
    return Array.from({ length: pageCount }, (_, index) => index)
  }

  const indices = new Set<number>()
  for (const token of selection.split(',')) {
    const part = token.trim()
    if (!part) continue
    const match = part.match(/^(\d+)(?:\s*-\s*(\d+))?$/)
    if (!match) throw new Error('invalid_page_range')
    const start = Number(match[1])
    const end = Number(match[2] ?? match[1])
    if (start < 1 || end < start || end > pageCount) throw new Error('invalid_page_range')
    for (let page = start; page <= end; page += 1) indices.add(page - 1)
  }
  if (indices.size === 0) throw new Error('invalid_page_range')
  return [...indices]
}

export function parsePageSelection(selection: string, pageCount: number) {
  return normalizedPageIndices(selection, pageCount)
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

export async function extractPdfPages(file: File, selection: string): Promise<ToolResult> {
  const { PDFDocument } = await import('pdf-lib')
  const source = await PDFDocument.load(await file.arrayBuffer())
  const indices = normalizedPageIndices(selection, source.getPageCount())
  const output = await PDFDocument.create()
  const pages = await output.copyPages(source, indices)
  pages.forEach((page) => output.addPage(page))
  return {
    blob: bytesToBlob(await output.save(), 'application/pdf'),
    filename: downloadName(file.name, 'extracted.pdf'),
    mimeType: 'application/pdf',
  }
}

export async function removePdfPages(file: File, selection: string): Promise<ToolResult> {
  const { PDFDocument } = await import('pdf-lib')
  const source = await PDFDocument.load(await file.arrayBuffer())
  const removed = new Set(normalizedPageIndices(selection, source.getPageCount()))
  const retained = source.getPageIndices().filter((index) => !removed.has(index))
  if (retained.length === 0) throw new Error('cannot_remove_all_pages')
  const output = await PDFDocument.create()
  const pages = await output.copyPages(source, retained)
  pages.forEach((page) => output.addPage(page))
  return {
    blob: bytesToBlob(await output.save(), 'application/pdf'),
    filename: downloadName(file.name, 'trimmed.pdf'),
    mimeType: 'application/pdf',
  }
}

export async function rotatePdfPages(file: File, selection: string, rotation: 90 | 180 | 270): Promise<ToolResult> {
  const { degrees, PDFDocument } = await import('pdf-lib')
  const document = await PDFDocument.load(await file.arrayBuffer())
  const indices = normalizedPageIndices(selection, document.getPageCount())
  for (const index of indices) {
    const page = document.getPage(index)
    const current = page.getRotation().angle
    page.setRotation(degrees((current + rotation) % 360))
  }
  return {
    blob: bytesToBlob(await document.save(), 'application/pdf'),
    filename: downloadName(file.name, 'rotated.pdf'),
    mimeType: 'application/pdf',
  }
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
  if (output.getPageCount() === 0) throw new Error('no_images')
  return {
    blob: bytesToBlob(await output.save(), 'application/pdf'),
    filename: 'images.pdf',
    mimeType: 'application/pdf',
  }
}
