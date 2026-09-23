import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import {
  extractPdfPages,
  mergePdfs,
  numberPdfPages,
  parsePageOrder,
  parsePageSelection,
  removePdfPages,
  reorderPdfPages,
  rotatePdfPages,
  splitPdf,
  watermarkPdf,
} from './pdf-tools'

function asFile(bytes: Uint8Array, name: string) {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }) as Blob & { name: string }
  blob.name = name
  return blob as File
}
async function createPdf(pageCount: number) {
  const pdf = await PDFDocument.create()
  for (let index = 0; index < pageCount; index += 1) pdf.addPage([320, 240])
  return pdf.save()
}

describe('PDF tools', () => {
  it('parses page ranges without duplicates', () => expect(parsePageSelection('1-3, 2, 5', 5)).toEqual([0, 1, 2, 4]))
  it('rejects pages outside the document', () =>
    expect(() => parsePageSelection('1-6', 5)).toThrow('invalid_page_range'))
  it('merges and splits PDF pages', async () => {
    const merged = await mergePdfs([asFile(await createPdf(1), 'a.pdf'), asFile(await createPdf(2), 'b.pdf')])
    expect((await PDFDocument.load(await merged.blob!.arrayBuffer())).getPageCount()).toBe(3)
    expect(await splitPdf(asFile(await createPdf(3), 'report.pdf'))).toHaveLength(3)
  })
  it('extracts selected pages', async () => {
    const result = await extractPdfPages(asFile(await createPdf(4), 'report.pdf'), '2-3')
    expect((await PDFDocument.load(await result.blob!.arrayBuffer())).getPageCount()).toBe(2)
  })
  it('removes pages but never every page', async () => {
    const file = asFile(await createPdf(3), 'report.pdf')
    const result = await removePdfPages(file, '2')
    expect((await PDFDocument.load(await result.blob!.arrayBuffer())).getPageCount()).toBe(2)
    await expect(removePdfPages(file, 'all')).rejects.toThrow('cannot_remove_all_pages')
  })
  it('rotates selected pages', async () => {
    const result = await rotatePdfPages(asFile(await createPdf(2), 'report.pdf'), '2', 90)
    const loaded = await PDFDocument.load(await result.blob!.arrayBuffer())
    expect(loaded.getPage(0).getRotation().angle).toBe(0)
    expect(loaded.getPage(1).getRotation().angle).toBe(90)
  })
  it('requires a full unique page order and reorders page dimensions', async () => {
    expect(parsePageOrder('3,1,2', 3)).toEqual([2, 0, 1])
    expect(() => parsePageOrder('1,1,2', 3)).toThrow('invalid_page_order')
    expect(() => parsePageOrder('1,2', 3)).toThrow('invalid_page_order')
    const original = await PDFDocument.create()
    original.addPage([100, 200])
    original.addPage([200, 300])
    original.addPage([300, 400])
    const result = await reorderPdfPages(asFile(await original.save(), 'ordered.pdf'), '3,1,2')
    const output = await PDFDocument.load(await result.blob!.arrayBuffer())
    expect(output.getPages().map((page) => page.getWidth())).toEqual([300, 100, 200])
  })
  it('adds watermark and page numbers without changing page count', async () => {
    const input = asFile(await createPdf(2), 'report.pdf')
    const watermarked = await watermarkPdf(input, 'DRAFT')
    const numbered = await numberPdfPages(input)
    expect((await PDFDocument.load(await watermarked.blob!.arrayBuffer())).getPageCount()).toBe(2)
    expect((await PDFDocument.load(await numbered.blob!.arrayBuffer())).getPageCount()).toBe(2)
    await expect(watermarkPdf(input, '草稿')).rejects.toThrow('latin_watermark_only')
  })
})
