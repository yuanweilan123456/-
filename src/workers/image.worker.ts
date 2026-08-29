type ImageFormat = 'original' | 'jpeg' | 'png' | 'webp'

type Settings = {
  format: ImageFormat
  quality: number
  width?: number
  keepRatio: boolean
}

type RequestMessage = { buffer: ArrayBuffer; name: string; inputMime: string; settings: Settings }

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<RequestMessage>) => void) | null
  postMessage: (message: unknown, transfer?: Transferable[]) => void
}

const getMime = (format: ImageFormat, inputMime: string) => {
  if (format === 'jpeg') return 'image/jpeg'
  if (format === 'png') return 'image/png'
  if (format === 'webp') return 'image/webp'
  return ['image/jpeg', 'image/png', 'image/webp'].includes(inputMime) ? inputMime : 'image/png'
}

const getExtension = (mimeType: string) =>
  mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/webp' ? 'webp' : 'png'

const getName = (inputName: string, mimeType: string) => {
  const base =
    inputName
      .replace(/\.[^/.]+$/, '')
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-')
      .trim() || 'image'
  return `${base}.${getExtension(mimeType)}`
}

workerScope.onmessage = async ({ data }) => {
  try {
    workerScope.postMessage({ type: 'progress', value: 12 })
    const source = await createImageBitmap(new Blob([data.buffer], { type: data.inputMime }))
    const targetWidth =
      data.settings.width && data.settings.width < source.width
        ? Math.max(1, Math.round(data.settings.width))
        : source.width
    const targetHeight =
      targetWidth === source.width
        ? source.height
        : Math.max(1, Math.round((source.height * targetWidth) / source.width))
    if (source.width * source.height > 40_000_000) throw new Error('too_many_pixels')
    const canvas = new OffscreenCanvas(targetWidth, targetHeight)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('canvas_unavailable')
    context.drawImage(source, 0, 0, targetWidth, targetHeight)
    source.close()
    workerScope.postMessage({ type: 'progress', value: 68 })
    const mimeType = getMime(data.settings.format, data.inputMime)
    const blob = await canvas.convertToBlob({ type: mimeType, quality: data.settings.quality / 100 })
    const buffer = await blob.arrayBuffer()
    workerScope.postMessage({ type: 'progress', value: 100 })
    workerScope.postMessage(
      {
        type: 'success',
        result: {
          buffer,
          outputName: getName(data.name, mimeType),
          width: targetWidth,
          height: targetHeight,
          mimeType,
        },
      },
      [buffer],
    )
  } catch (error) {
    workerScope.postMessage({ type: 'error', message: error instanceof Error ? error.message : 'processing_failed' })
  }
}
