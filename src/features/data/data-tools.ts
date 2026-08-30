import { downloadName } from '../tools/result'
import type { ToolResult } from '../tools/types'

function parseCsvRows(text: string) {
  const rows: string[][] = []
  let row: string[] = []
  let value = ''
  let quoted = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        value += '"'
        index += 1
      } else if (character === '"') {
        quoted = false
      } else {
        value += character
      }
    } else if (character === '"') {
      quoted = true
    } else if (character === ',') {
      row.push(value)
      value = ''
    } else if (character === '\n') {
      row.push(value.replace(/\r$/, ''))
      rows.push(row)
      row = []
      value = ''
    } else {
      value += character
    }
  }
  if (quoted) throw new Error('invalid_csv')
  if (value.length || row.length) {
    row.push(value.replace(/\r$/, ''))
    rows.push(row)
  }
  return rows.filter((item) => item.some((cell) => cell.length > 0))
}

function uniqueHeaders(headers: string[]) {
  const counts = new Map<string, number>()
  return headers.map((header, index) => {
    const base = header.trim() || `column_${index + 1}`
    const count = (counts.get(base) ?? 0) + 1
    counts.set(base, count)
    return count === 1 ? base : `${base}_${count}`
  })
}

export function formatJson(text: string, minify = false): ToolResult {
  const value: unknown = JSON.parse(text)
  const formatted = JSON.stringify(value, null, minify ? 0 : 2)
  return {
    text: formatted,
    filename: minify ? 'data.min.json' : 'data.formatted.json',
    mimeType: 'application/json;charset=utf-8',
  }
}

export function csvTextToJson(text: string, sourceName = 'data.csv'): ToolResult {
  const rows = parseCsvRows(text.replace(/^\uFEFF/, ''))
  if (rows.length === 0) throw new Error('empty_csv')
  const headers = uniqueHeaders(rows[0])
  const records = rows
    .slice(1)
    .map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ''])))
  return {
    text: JSON.stringify(records, null, 2),
    filename: downloadName(sourceName, 'json'),
    mimeType: 'application/json;charset=utf-8',
  }
}

function csvCell(value: unknown) {
  const text =
    value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value)
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function jsonTextToCsv(text: string): ToolResult {
  const parsed: unknown = JSON.parse(text)
  if (!Array.isArray(parsed)) throw new Error('json_array_required')
  const records = parsed as Array<Record<string, unknown>>
  if (records.some((record) => !record || Array.isArray(record) || typeof record !== 'object')) {
    throw new Error('json_objects_required')
  }
  const headers = [...new Set(records.flatMap((record) => Object.keys(record)))]
  if (headers.length === 0) throw new Error('empty_json_array')
  const rows = [
    headers.map(csvCell).join(','),
    ...records.map((record) => headers.map((header) => csvCell(record[header])).join(',')),
  ]
  return { text: `\uFEFF${rows.join('\r\n')}`, filename: 'data.csv', mimeType: 'text/csv;charset=utf-8' }
}
