import { test, expect, type Page } from '@playwright/test'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { Document, Packer, Paragraph, TextRun, PageBreak, Table, TableRow, TableCell } from 'docx'
import JSZip from 'jszip'
import { readFile } from 'node:fs/promises'

let pdfBytes: Buffer
let scanBytes: Buffer
let wordBytes: Buffer
let longWordBytes: Buffer
const docxMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

test.beforeAll(async () => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  pdf.addPage([595, 842]).drawText('FileTools conversion test - page one', { x: 40, y: 770, font, size: 18 })
  pdf.addPage([595, 842]).drawText('Second page editable text', { x: 40, y: 770, font, size: 18 })
  pdfBytes = Buffer.from(await pdf.save())
  const scan = await PDFDocument.create()
  const page = scan.addPage([595, 842])
  page.drawRectangle({ x: 60, y: 100, width: 400, height: 600, color: rgb(0.2, 0.3, 0.8) })
  scanBytes = Buffer.from(await scan.save())
  wordBytes = await Packer.toBuffer(
    new Document({
      sections: [
        {
          children: [
            new Paragraph({ children: [new TextRun({ text: 'FileTools document conversion', bold: true, size: 36 })] }),
            new Paragraph('中文测试：你好，文件工具箱。English text and tables.'),
            new Table({
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Item')] }),
                    new TableCell({ children: [new Paragraph('Value')] }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Local')] }),
                    new TableCell({ children: [new Paragraph('Private')] }),
                  ],
                }),
              ],
            }),
            new Paragraph({ children: [new PageBreak()] }),
            new Paragraph('Second page — conversion completed.'),
          ],
        },
      ],
    }),
  )
  longWordBytes = await Packer.toBuffer(
    new Document({
      sections: [
        {
          children: Array.from(
            { length: 100 },
            (_, index) =>
              new Paragraph(
                `Paragraph ${index + 1}: This document deliberately overflows a page without manual page breaks.`,
              ),
          ),
        },
      ],
    }),
  )
})

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('filetools-locale', 'en')
    localStorage.setItem('filetools-theme', 'light')
  })
})

async function select(page: Page, route: string, buffer: Buffer, name: string, mimeType: string) {
  await page.goto(route)
  await page.locator('input[type=file]').setInputFiles({ name, mimeType, buffer })
}
async function convertAndDownload(page: Page) {
  await page.locator('.converter-submit').click()
  await expect(page.locator('.converter-result')).toBeVisible({ timeout: 60000 })
  const downloading = page.waitForEvent('download')
  await page.getByRole('link', { name: 'Download file' }).click()
  const download = await downloading
  const bytes = await readFile((await download.path())!)
  expect(bytes.length).toBeGreaterThan(0)
  return { bytes, filename: download.suggestedFilename() }
}

test('DOCX → PDF: real bilingual, table, two-page document renders and downloads', async ({ page }, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const outgoing: string[] = []
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1') && !/^(data|blob):/.test(request.url()))
      outgoing.push(request.url())
  })
  await select(page, '/tools/pdf/word-to-pdf', wordBytes, 'bilingual.docx', docxMime)
  const result = await convertAndDownload(page)
  expect(result.filename).toBe('bilingual.pdf')
  const pdf = await PDFDocument.load(result.bytes)
  expect(pdf.getPageCount()).toBe(2)
  expect(result.bytes.length).toBeGreaterThan(15000)
  await expect(page.locator('.converter-preview img')).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('word-pdf-result.png'), fullPage: true })
  expect(errors).toEqual([])
  // Advertising may load as part of the existing site; document conversion must never POST a file.
  expect(outgoing.filter((url) => /convert|office|document/.test(url))).toEqual([])
})

test('DOCX overflow is paginated rather than cut off', async ({ page }) => {
  await select(page, '/tools/pdf/word-to-pdf', longWordBytes, 'long.docx', docxMime)
  const result = await convertAndDownload(page)
  const pdf = await PDFDocument.load(result.bytes)
  expect(pdf.getPageCount()).toBeGreaterThan(1)
  expect(pdf.getPageCount()).toBeLessThan(10)
})

test('PDF → editable DOCX preserves selected page text and resets stale output', async ({ page }) => {
  await select(page, '/tools/pdf/to-word', pdfBytes, 'report.pdf', 'application/pdf')
  await page.getByPlaceholder('All pages, or 1,3-5').fill('2')
  const result = await convertAndDownload(page)
  expect(result.filename).toBe('report.docx')
  const zip = await JSZip.loadAsync(result.bytes)
  const xml = await zip.file('word/document.xml')!.async('string')
  expect(xml).toContain('Second page editable text')
  expect(xml).not.toContain('page one')
  await page.getByPlaceholder('All pages, or 1,3-5').fill('1')
  await expect(page.locator('.converter-result')).toHaveCount(0)
})

test('PDF → DOCX appearance mode embeds each page and scans fall back to images', async ({ page }) => {
  await select(page, '/tools/pdf/to-word', pdfBytes, 'report.pdf', 'application/pdf')
  await page.getByRole('radio', { name: /Page appearance/ }).check()
  const result = await convertAndDownload(page)
  const zip = await JSZip.loadAsync(result.bytes)
  expect(Object.keys(zip.files).filter((name) => /word\/media\/.+\.jpg$/.test(name))).toHaveLength(2)
  await select(page, '/tools/pdf/to-word', scanBytes, 'scan.pdf', 'application/pdf')
  const scanResult = await convertAndDownload(page)
  await expect(page.locator('.converter-warning')).toContainText('No text layer')
  const scanZip = await JSZip.loadAsync(scanResult.bytes)
  expect(Object.keys(scanZip.files).filter((name) => /\.jpg$/.test(name))).toHaveLength(1)
})

test('PDF → JPG exports a ZIP with selected pages and valid JPEG bytes', async ({ page }) => {
  await select(page, '/tools/pdf/to-images', pdfBytes, 'report.pdf', 'application/pdf')
  await page.getByPlaceholder('All pages, or 1,3-5').fill('2')
  const result = await convertAndDownload(page)
  const zip = await JSZip.loadAsync(result.bytes)
  expect(Object.keys(zip.files)).toEqual(['page-002.jpg'])
  const jpg = await zip.file('page-002.jpg')!.async('uint8array')
  expect(Array.from(jpg.slice(0, 3))).toEqual([255, 216, 255])
})

test('PDF → TXT extracts both pages; scan-only PDFs explain OCR limitation', async ({ page }) => {
  await select(page, '/tools/pdf/to-text', pdfBytes, 'report.pdf', 'application/pdf')
  const result = await convertAndDownload(page)
  expect(result.bytes.toString('utf8')).toContain('page one')
  expect(result.bytes.toString('utf8')).toContain('Second page editable text')
  await select(page, '/tools/pdf/to-text', scanBytes, 'scan.pdf', 'application/pdf')
  await page.locator('.converter-submit').click()
  await expect(page.getByRole('alert')).toContainText('No text layer', { timeout: 30000 })
})

test('bad files, invalid page ranges, cancellation, and route changes recover safely', async ({ page }) => {
  await select(page, '/tools/pdf/word-to-pdf', Buffer.from('old'), 'legacy.doc', 'application/msword')
  await expect(page.getByRole('alert')).toContainText('Legacy .doc')
  await select(page, '/tools/pdf/to-word', Buffer.from('not a PDF'), 'bad.pdf', 'application/pdf')
  await page.locator('.converter-submit').click()
  await expect(page.getByRole('alert')).toContainText('not a readable PDF')
  await select(page, '/tools/pdf/to-word', pdfBytes, 'report.pdf', 'application/pdf')
  await page.getByPlaceholder('All pages, or 1,3-5').fill('99')
  await page.locator('.converter-submit').click()
  await expect(page.getByRole('alert')).toContainText('valid page numbers')
  await select(page, '/tools/pdf/word-to-pdf', longWordBytes, 'long.docx', docxMime)
  await page.locator('.converter-submit').click()
  await page.getByRole('button', { name: 'Cancel conversion' }).click()
  await expect(page.locator('.converter-submit')).toContainText('Convert to PDF', { timeout: 30000 })
  await expect(page.locator('.converter-result')).toHaveCount(0)
  await page
    .locator('.related-tools')
    .getByRole('link', { name: /PDF to Word/ })
    .click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('PDF to Word')
  await expect(page.locator('.converter-file-row')).toHaveCount(0)
})

test('mobile, dark mode, keyboard input, and Chinese labels remain usable', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => {
    localStorage.setItem('filetools-theme', 'dark')
    localStorage.setItem('filetools-locale', 'zh')
  })
  await page.goto('/tools/pdf/to-word')
  await expect(page.getByRole('heading', { name: 'PDF 转 Word', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: '选择 PDF 文件' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('mobile-dark-zh.png'), fullPage: true })
  await page.getByPlaceholder('全部页面，或 1,3-5').fill('1')
  await expect(page.getByPlaceholder('全部页面，或 1,3-5')).toHaveValue('1')
})
