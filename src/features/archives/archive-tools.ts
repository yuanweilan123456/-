import JSZip from 'jszip'
import type { ToolResult } from '../tools/types'

function safeArchivePath(path: string) {
  return path
    .replace(/\\/g, '/')
    .split('/')
    .filter((part) => part && part !== '.' && part !== '..')
    .join('/')
}

export async function createZip(files: File[]): Promise<ToolResult> {
  if (files.length === 0) throw new Error('files_required')
  const zip = new JSZip()
  const used = new Set<string>()
  for (const file of files) {
    let name = safeArchivePath(file.name) || 'file'
    let counter = 2
    while (used.has(name)) {
      const dot = name.lastIndexOf('.')
      const base = dot > 0 ? name.slice(0, dot) : name
      const extension = dot > 0 ? name.slice(dot) : ''
      name = `${base}-${counter}${extension}`
      counter += 1
    }
    used.add(name)
    zip.file(name, await file.arrayBuffer())
  }
  return {
    blob: await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } }),
    filename: 'pixelforge-files.zip',
    mimeType: 'application/zip',
  }
}

export async function extractZip(file: File): Promise<ToolResult[]> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer())
  const results: ToolResult[] = []
  for (const entry of Object.values(zip.files)) {
    if (entry.dir) continue
    const filename = safeArchivePath(entry.name)
    if (!filename) continue
    results.push({
      blob: await entry.async('blob'),
      filename,
      mimeType: 'application/octet-stream',
    })
  }
  if (results.length === 0) throw new Error('empty_archive')
  return results
}
