type ImageFormat = 'original' | 'jpeg' | 'png' | 'webp'

type Settings = {
  format: ImageFormat
  quality: number
  width?: number
  keepRatio: boolean
  rotation: 0 | 90 | 180 | 270
  flipHorizontal: boolean
  flipVertical: boolean
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
    const rotated = data.settings.rotation === 90 || data.settings.rotation === 270
    const canvas = new OffscreenCanvas(rotated ? targetHeight : targetWidth, rotated ? targetWidth : targetHeight)
    const context = canvas.getContext('2d')
    if (!context) throw new Error('canvas_unavailable')
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate((data.settings.rotation * Math.PI) / 180)
    context.scale(data.settings.flipHorizontal ? -1 : 1, data.settings.flipVertical ? -1 : 1)
    context.drawImage(source, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight)
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
          width: canvas.width,
          height: canvas.height,
          mimeType,
        },
      },
      [buffer],
    )
  } catch (error) {
    workerScope.postMessage({ type: 'error', message: error instanceof Error ? error.message : 'processing_failed' })
  }
}
