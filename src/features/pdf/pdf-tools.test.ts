import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { extractPdfPages, mergePdfs, parsePageSelection, removePdfPages, rotatePdfPages, splitPdf } from './pdf-tools'

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
})
