import { describe, expect, it } from 'vitest'
import { csvTextToJson, formatJson, jsonTextToCsv } from './data-tools'

describe('data tools', () => {
  it('formats and minifies JSON', () => {
    expect(formatJson('{"a":1}').text).toBe('{\n  "a": 1\n}')
    expect(formatJson('{ "a": 1 }', true).text).toBe('{"a":1}')
  })
  it('parses quoted CSV cells', () => {
    const result = csvTextToJson('name,note\nAda,"hello, world"')
    expect(JSON.parse(result.text!)).toEqual([{ name: 'Ada', note: 'hello, world' }])
  })
  it('creates unique headers for duplicate CSV columns', () => {
    const result = csvTextToJson('name,name\nA,B')
    expect(JSON.parse(result.text!)).toEqual([{ name: 'A', name_2: 'B' }])
  })
  it('converts object arrays to CSV', () => {
    expect(jsonTextToCsv('[{"name":"Ada","note":"a,b"}]').text).toContain('Ada,"a,b"')
  })
  it('rejects a non-array JSON value', () => expect(() => jsonTextToCsv('{"a":1}')).toThrow('json_array_required'))
})
