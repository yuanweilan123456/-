export type ImageFormat = 'original' | 'jpeg' | 'png' | 'webp'

export type ImageProcessSettings = {
  format: ImageFormat
  quality: number
  width?: number
  keepRatio: boolean
  rotation: 0 | 90 | 180 | 270
  flipHorizontal: boolean
  flipVertical: boolean
}

export type ProcessedImage = {
  blob: Blob
  outputName: string
  width: number
  height: number
  mimeType: string
}

export const MAX_FILE_SIZE = 20 * 1024 * 1024
export const MAX_BATCH_COUNT = 20
export const MAX_PIXEL_COUNT = 40_000_000

export function getOutputMime(format: ImageFormat, inputMime: string): string {
  if (format === 'jpeg') return 'image/jpeg'
  if (format === 'png') return 'image/png'
  if (format === 'webp') return 'image/webp'
  if (inputMime === 'image/jpeg' || inputMime === 'image/png' || inputMime === 'image/webp') return inputMime
  return 'image/png'
}

export function getOutputExtension(mimeType: string): string {
  if (mimeType === 'image/jpeg') return 'jpg'
  if (mimeType === 'image/webp') return 'webp'
  return 'png'
}

export function getOutputName(inputName: string, mimeType: string): string {
  const baseName =
    inputName
      .replace(/\.[^/.]+$/, '')
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-')
      .trim() || 'image'
  return `${baseName}.${getOutputExtension(mimeType)}`
}

export function fitDimensions(width: number, height: number, targetWidth?: number): { width: number; height: number } {
  if (!targetWidth || targetWidth >= width) return { width, height }
  return {
    width: Math.max(1, Math.round(targetWidth)),
    height: Math.max(1, Math.round((height * targetWidth) / width)),
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      URL.revokeObjectURL(url)
      resolve({ width: image.naturalWidth, height: image.naturalHeight })
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('decode_failed'))
    }
    image.src = url
  })
}

async function processOnCanvas(
  file: File,
  settings: ImageProcessSettings,
  onProgress: (value: number) => void,
): Promise<ProcessedImage> {
  onProgress(12)
  const dimensions = await readImageDimensions(file)
  if (dimensions.width * dimensions.height > MAX_PIXEL_COUNT) throw new Error('too_many_pixels')
  const target = fitDimensions(dimensions.width, dimensions.height, settings.width)
  const imageUrl = URL.createObjectURL(file)

  try {
    const image = new Image()
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('decode_failed'))
      image.src = imageUrl
    })
    const canvas = document.createElement('canvas')
    const rotated = settings.rotation === 90 || settings.rotation === 270
    canvas.width = rotated ? target.height : target.width
    canvas.height = rotated ? target.width : target.height
    const context = canvas.getContext('2d')
    if (!context) throw new Error('canvas_unavailable')
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate((settings.rotation * Math.PI) / 180)
    context.scale(settings.flipHorizontal ? -1 : 1, settings.flipVertical ? -1 : 1)
    context.drawImage(image, -target.width / 2, -target.height / 2, target.width, target.height)
    onProgress(68)
    const mimeType = getOutputMime(settings.format, file.type)
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => (result ? resolve(result) : reject(new Error('encode_failed'))),
        mimeType,
        settings.quality / 100,
      )
    })
    onProgress(100)
    return {
      blob,
      outputName: getOutputName(file.name, mimeType),
      width: canvas.width,
      height: canvas.height,
      mimeType,
    }
  } finally {
    URL.revokeObjectURL(imageUrl)
  }
}

function processWithWorker(
  file: File,
  settings: ImageProcessSettings,
  onProgress: (value: number) => void,
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../../workers/image.worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (
      event: MessageEvent<
        | { type: 'progress'; value: number }
        | { type: 'success'; result: Omit<ProcessedImage, 'blob'> & { buffer: ArrayBuffer } }
        | { type: 'error'; message: string }
      >,
    ) => {
      if (event.data.type === 'progress') onProgress(event.data.value)
      if (event.data.type === 'success') {
        worker.terminate()
        const result = event.data.result
        resolve({
          blob: new Blob([result.buffer], { type: result.mimeType }),
          outputName: result.outputName,
          width: result.width,
          height: result.height,
          mimeType: result.mimeType,
        })
      }
      if (event.data.type === 'error') {
        worker.terminate()
        reject(new Error(event.data.message))
      }
    }
    worker.onerror = () => {
      worker.terminate()
      reject(new Error('worker_unavailable'))
    }
    void file
      .arrayBuffer()
      .then((buffer) => worker.postMessage({ buffer, name: file.name, inputMime: file.type, settings }, [buffer]))
      .catch(() => reject(new Error('read_failed')))
  })
}

export async function processImage(
  file: File,
  settings: ImageProcessSettings,
  onProgress: (value: number) => void = () => undefined,
): Promise<ProcessedImage> {
  const useWorker =
    typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined' && typeof createImageBitmap !== 'undefined'
  if (useWorker) {
    try {
      return await processWithWorker(file, settings, onProgress)
    } catch (error) {
      if (error instanceof Error && !['worker_unavailable', 'read_failed'].includes(error.message)) throw error
    }
  }
  return processOnCanvas(file, settings, onProgress)
}
