import { describe, expect, it } from 'vitest'
import JSZip from 'jszip'
import {
  fitDimensions,
  formatBytes,
  getInputMime,
  getOutputExtension,
  getOutputMime,
  getOutputName,
} from './image-processor'
import { shouldKeepOriginal } from './image-rules'

describe('image processor helpers', () => {
  it('maps formats to MIME types', () => {
    expect(getOutputMime('jpeg', 'image/png')).toBe('image/jpeg')
    expect(getOutputMime('png', 'image/jpeg')).toBe('image/png')
    expect(getOutputMime('original', 'image/webp')).toBe('image/webp')
    expect(getOutputMime('original', 'image/heic')).toBe('image/png')
  })

  it('infers missing or non-standard MIME types from image names', () => {
    expect(getInputMime('', 'photo.JPG')).toBe('image/jpeg')
    expect(getInputMime('image/jpg', 'photo.jpg')).toBe('image/jpeg')
    expect(getInputMime('', 'graphic.png')).toBe('image/png')
  })

  it('keeps an already optimized source instead of creating a larger copy', () => {
    expect(shouldKeepOriginal(1000, 1200, 'image/jpeg', 'image/jpeg', false, 0, false, false)).toBe(true)
    expect(shouldKeepOriginal(1000, 900, 'image/jpeg', 'image/jpeg', false, 0, false, false)).toBe(false)
    expect(shouldKeepOriginal(1000, 1200, 'image/jpeg', 'image/webp', false, 0, false, false)).toBe(false)
    expect(shouldKeepOriginal(1000, 1200, 'image/jpeg', 'image/jpeg', true, 0, false, false)).toBe(false)
    expect(shouldKeepOriginal(1000, 1200, 'image/jpeg', 'image/jpeg', false, 90, false, false)).toBe(false)
  })

  it('keeps ratio while resizing down', () => {
    expect(fitDimensions(1600, 900, 800)).toEqual({ width: 800, height: 450 })
    expect(fitDimensions(800, 600, 1200)).toEqual({ width: 800, height: 600 })
  })

  it('sanitizes output names and uses the correct extension', () => {
    expect(getOutputExtension('image/jpeg')).toBe('jpg')
    expect(getOutputName('my:holiday?.png', 'image/webp')).toBe('my-holiday-.webp')
  })

  it('formats readable byte sizes', () => {
    expect(formatBytes(900)).toBe('900 B')
    expect(formatBytes(2048)).toBe('2.0 KB')
    expect(formatBytes(2 * 1024 * 1024)).toBe('2.00 MB')
  })

  it('can package processed results into a ZIP archive', async () => {
    const zip = new JSZip()
    zip.file('converted.webp', new TextEncoder().encode('image-result'))
    const archive = await zip.generateAsync({ type: 'uint8array' })
    const loaded = await JSZip.loadAsync(archive)
    expect(Object.keys(loaded.files)).toEqual(['converted.webp'])
    expect(await loaded.file('converted.webp')?.async('string')).toBe('image-result')
  })
})
