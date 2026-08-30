import { describe, expect, it } from 'vitest'
import JSZip from 'jszip'
import { textToPptx } from './presentation-tools'

describe('presentation tools', () => {
  it('creates one editable slide per text section', async () => {
    const result = await textToPptx('First slide\nPoint one\nPoint two\n\nSecond slide\nAnother point')
    const zip = await JSZip.loadAsync(await result.blob!.arrayBuffer())
    expect(zip.file('ppt/slides/slide1.xml')).toBeTruthy()
    expect(zip.file('ppt/slides/slide2.xml')).toBeTruthy()
    expect(await zip.file('ppt/slides/slide1.xml')?.async('string')).toContain('First slide')
    expect(await zip.file('ppt/presentation.xml')?.async('string')).toContain('rId3')
  })

  it('escapes XML-sensitive text', async () => {
    const result = await textToPptx('A & B\n<private>')
    const zip = await JSZip.loadAsync(await result.blob!.arrayBuffer())
    const slide = await zip.file('ppt/slides/slide1.xml')?.async('string')
    expect(slide).toContain('A &amp; B')
    expect(slide).toContain('&lt;private&gt;')
  })
})
