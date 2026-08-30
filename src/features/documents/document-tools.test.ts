import { describe, expect, it } from 'vitest'
import JSZip from 'jszip'
import { docxToHtml, docxToText, textToDocx } from './document-tools'

function asFile(blob: Blob, name: string) {
  const file = blob as Blob & { name: string }
  file.name = name
  return file as File
}

describe('document tools', () => {
  it('creates a valid DOCX from text', async () => {
    const result = await textToDocx('PixelForge\nLocal tools')
    const zip = await JSZip.loadAsync(await result.blob!.arrayBuffer())
    expect(await zip.file('word/document.xml')?.async('string')).toContain('PixelForge')
  })
  it('round-trips simple DOCX text into HTML and plain text', async () => {
    const created = await textToDocx('PixelForge test')
    const file = asFile(created.blob!, 'sample.docx')
    expect((await docxToHtml(file)).text).toContain('PixelForge test')
    expect((await docxToText(file)).text).toContain('PixelForge test')
  })
})
