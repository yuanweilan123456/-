import { describe, expect, it } from 'vitest'
import { PDFDocument } from 'pdf-lib'
import { docxToHtml, mergePdfs, splitPdf, textResultToBlob } from './file-tools'
import JSZip from 'jszip'

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

describe('file toolbox helpers', () => {
  it('merges PDF pages in order', async () => {
    const merged = await mergePdfs([asFile(await createPdf(1), 'first.pdf'), asFile(await createPdf(2), 'second.pdf')])
    const loaded = await PDFDocument.load(await merged.blob!.arrayBuffer())
    expect(loaded.getPageCount()).toBe(3)
  })

  it('splits a PDF into one document per page', async () => {
    const results = await splitPdf(asFile(await createPdf(3), 'report.pdf'))
    expect(results).toHaveLength(3)
    const second = await PDFDocument.load(await results[1].blob!.arrayBuffer())
    expect(second.getPageCount()).toBe(1)
    expect(results[1].filename).toBe('report.page-2.pdf')
  })

  it('wraps extracted document HTML in a downloadable blob', () => {
    const blob = textResultToBlob({ text: '<h1>Hello</h1>', filename: 'hello.html', mimeType: 'text/html' })
    expect(blob?.type).toBe('text/html')
  })

  it('converts a minimal DOCX document to HTML', async () => {
    const docx = new JSZip()
    docx.file(
      '[Content_Types].xml',
      '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
    )
    docx.file(
      '_rels/.rels',
      '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
    )
    docx.file(
      'word/document.xml',
      '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>PixelForge test</w:t></w:r></w:p><w:sectPr/></w:body></w:document>',
    )
    const bytes = await docx.generateAsync({ type: 'uint8array' })
    const file = new Blob([bytes.buffer as ArrayBuffer]) as Blob & { name: string }
    file.name = 'sample.docx'
    const result = await docxToHtml(file as File)
    expect(result.text).toContain('PixelForge test')
  })
})
