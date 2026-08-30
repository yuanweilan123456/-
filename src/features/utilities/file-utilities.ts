import { downloadName } from '../tools/result'
import type { ToolResult } from '../tools/types'

export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512'

export async function calculateChecksum(file: File, algorithm: HashAlgorithm): Promise<ToolResult> {
  const digest = await crypto.subtle.digest(algorithm, await file.arrayBuffer())
  const checksum = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  return {
    text: `${algorithm}  ${checksum}  ${file.name}\n`,
    filename: downloadName(file.name, `${algorithm.toLowerCase()}.txt`),
    mimeType: 'text/plain;charset=utf-8',
  }
}

export async function fileToBase64(file: File): Promise<ToolResult> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('read_failed'))
    reader.readAsDataURL(file)
  })
  return {
    text: dataUrl,
    filename: downloadName(file.name, 'base64.txt'),
    mimeType: 'text/plain;charset=utf-8',
  }
}

export function base64ToFile(value: string, filename: string, fallbackMimeType: string): ToolResult {
  const input = value.trim()
  if (!input) throw new Error('base64_required')
  const dataUrl = input.match(/^data:([^;,]+)?(?:;charset=[^;,]+)?;base64,(.*)$/s)
  const mimeType = dataUrl?.[1] || fallbackMimeType.trim() || 'application/octet-stream'
  const payload = (dataUrl?.[2] ?? input).replace(/\s/g, '')
  let binary: string
  try {
    binary = atob(payload)
  } catch {
    throw new Error('invalid_base64')
  }
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
  return {
    blob: new Blob([bytes], { type: mimeType }),
    filename: filename.trim() || 'decoded-file.bin',
    mimeType,
  }
}
