import { describe, expect, it } from 'vitest'
import JSZip from 'jszip'
import { createZip, extractZip } from './archive-tools'

function asFile(blob: Blob, name: string) {
  const file = blob as Blob & { name: string }
  file.name = name
  return file as File
}

describe('archive tools', () => {
  it('creates a ZIP from multiple files', async () => {
    const result = await createZip([asFile(new Blob(['one']), 'one.txt'), asFile(new Blob(['two']), 'two.txt')])
    const zip = await JSZip.loadAsync(await result.blob!.arrayBuffer())
    expect(Object.keys(zip.files)).toEqual(['one.txt', 'two.txt'])
  })
  it('extracts files and ignores directories', async () => {
    const zip = new JSZip()
    zip.file('docs/readme.txt', 'hello')
    const input = asFile(await zip.generateAsync({ type: 'blob' }), 'files.zip')
    const results = await extractZip(input)
    expect(results.map((item) => item.filename)).toEqual(['docs/readme.txt'])
  })
})
