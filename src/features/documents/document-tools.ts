import JSZip from 'jszip'
import { downloadName } from '../tools/result'
import type { ToolResult } from '../tools/types'

function escapeXml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export async function docxToHtml(file: File): Promise<ToolResult> {
  const { default: mammoth } = await import('mammoth/mammoth.browser.js')
  const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() })
  const page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeXml(file.name)}</title></head><body>${result.value}</body></html>`
  return { text: page, filename: downloadName(file.name, 'html'), mimeType: 'text/html;charset=utf-8' }
}

export async function docxToText(file: File): Promise<ToolResult> {
  const { default: mammoth } = await import('mammoth/mammoth.browser.js')
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })
  return { text: result.value, filename: downloadName(file.name, 'txt'), mimeType: 'text/plain;charset=utf-8' }
}

export async function textToDocx(text: string): Promise<ToolResult> {
  if (!text.trim()) throw new Error('text_required')
  const paragraphs = text
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`)
    .join('')
  const zip = new JSZip()
  zip.file(
    '[Content_Types].xml',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
  )
  zip.file(
    '_rels/.rels',
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
  )
  zip.file(
    'word/document.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs}<w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr></w:body></w:document>`,
  )
  return {
    blob: await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    }),
    filename: 'pixelforge-document.docx',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }
}
