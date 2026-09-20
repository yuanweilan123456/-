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
    const result = await textToDocx('FileTools\nLocal tools')
    const zip = await JSZip.loadAsync(await result.blob!.arrayBuffer())
    expect(await zip.file('word/document.xml')?.async('string')).toContain('FileTools')
  })
  it('round-trips simple DOCX text into HTML and plain text', async () => {
    const created = await textToDocx('FileTools test')
    const file = asFile(created.blob!, 'sample.docx')
    expect((await docxToHtml(file)).text).toContain('FileTools test')
    expect((await docxToText(file)).text).toContain('FileTools test')
  })
})
