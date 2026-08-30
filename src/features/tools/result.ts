import type { ToolResult } from './types'

export function safeBaseName(name: string) {
  return (
    name
      .replace(/\.[^/.]+$/, '')
      .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '-')
      .trim() || 'file'
  )
}

export function downloadName(name: string, extension: string) {
  return `${safeBaseName(name)}.${extension}`
}

export function bytesToBlob(bytes: Uint8Array, mimeType: string) {
  return new Blob([bytes.buffer as ArrayBuffer], { type: mimeType })
}

export function resultToBlob(result: ToolResult) {
  if (result.blob) return result.blob
  if (result.text === undefined) return undefined
  return new Blob([result.text], { type: result.mimeType })
}
