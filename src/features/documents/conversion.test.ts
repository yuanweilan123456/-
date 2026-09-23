import { describe, expect, it } from 'vitest'
import {
  convertDocument,
  editablePdfLines,
  MAX_FILE_BYTES,
  pageSlices,
  textLines,
  validateConversionFile,
  type TextFragment,
} from './conversion'

const fragment = (str: string, x: number, y: number, width = 30, hasEOL = false): TextFragment => ({
  str,
  width,
  height: 12,
  transform: [12, 0, 0, 12, x, y],
  hasEOL,
})

describe('document conversion safeguards', () => {
  it('accepts DOCX and PDF, rejects empty, oversized, mismatched, and legacy files', () => {
    expect(() => validateConversionFile(new File(['PK'], 'REPORT.DOCX'), 'word-to-pdf')).not.toThrow()
    expect(() => validateConversionFile(new File(['%PDF'], 'report.pdf'), 'pdf-to-word')).not.toThrow()
    expect(() => validateConversionFile(new File([], 'empty.pdf'), 'pdf-to-text')).toThrow('empty_file')
    expect(() => validateConversionFile(new File(['x'], 'old.doc'), 'word-to-pdf')).toThrow('legacy_doc')
    expect(() => validateConversionFile(new File(['x'], 'report.docx'), 'pdf-to-word')).toThrow('wrong_format')
    expect(() =>
      validateConversionFile({ name: 'big.pdf', size: MAX_FILE_BYTES + 1 } as File, 'pdf-to-images'),
    ).toThrow('file_too_large')
  })
  it('cancels before loading the conversion engine', async () => {
    const controller = new AbortController()
    controller.abort()
    await expect(
      convertDocument(
        new File(['%PDF'], 'report.pdf'),
        'pdf-to-word',
        { pages: '', password: '', mode: 'text', quality: 'standard' },
        controller.signal,
        () => {},
      ),
    ).rejects.toMatchObject({ name: 'AbortError' })
  })
})

describe('PDF text extraction', () => {
  it('reconstructs geometric word spacing and line breaks', () => {
    expect(textLines([fragment('Hello', 10, 100), fragment('world', 45, 100), fragment('Next line', 10, 80)])).toEqual([
      'Hello world',
      'Next line',
    ])
  })
  it('keeps adjacent Chinese characters together and honors explicit line endings', () => {
    expect(
      textLines([fragment('文', 10, 100, 12), fragment('档', 22, 100, 12, true), fragment('第二行', 10, 100)]),
    ).toEqual(['文档', '第二行'])
  })
  it('handles scans without inventing text', () => {
    expect(textLines([])).toEqual([])
  })
  it('preserves approximate line positions and text sizes for editable Word output', () => {
    const items = [fragment('Hello', 36, 100), fragment('world', 71, 100), fragment('Heading', 72, 70)]
    items[2].height = 18
    expect(editablePdfLines(items)).toEqual([
      {
        x: 36,
        y: 100,
        runs: [
          { text: 'Hello', size: 12 },
          { text: ' world', size: 12 },
        ],
      },
      { x: 72, y: 70, runs: [{ text: 'Heading', size: 18 }] },
    ])
  })
})

describe('Word overflow pagination', () => {
  it('preserves continuous coverage and avoids splitting through text', () => {
    expect(pageSlices(2300, 1000, [{ top: 990, bottom: 1010 }])).toEqual([
      { y: 0, height: 990 },
      { y: 990, height: 1000 },
      { y: 1990, height: 310 },
    ])
  })
  it('does not create an extra page at an exact boundary', () => {
    expect(pageSlices(2000, 1000, [])).toHaveLength(2)
  })
  it('limits output pages for large Word documents', () => {
    expect(() => pageSlices(101001, 1000, [])).toThrow('too_many_pages')
  })
})
