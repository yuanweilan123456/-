import { describe, expect, it } from 'vitest'
import { tools } from './catalog'
import { toolEditorial } from './editorial'

describe('tool editorial content', () => {
  it('covers every published tool in both languages', () => {
    expect(Object.keys(toolEditorial).sort()).toEqual(tools.map((tool) => tool.id).sort())

    for (const tool of tools) {
      const entry = toolEditorial[tool.id]
      expect(entry.reviewed).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      for (const language of ['en', 'zh'] as const) {
        const content = entry[language]
        expect(content.overview.length).toBeGreaterThan(language === 'zh' ? 35 : 75)
        expect(content.bestFor.length).toBeGreaterThan(language === 'zh' ? 10 : 20)
        expect(content.input.length).toBeGreaterThan(language === 'zh' ? 8 : 15)
        expect(content.output.length).toBeGreaterThan(language === 'zh' ? 8 : 15)
        expect(content.limitation.length).toBeGreaterThan(language === 'zh' ? 18 : 25)
        expect(content.tips).toHaveLength(2)
        expect(content.tips.every((tip) => tip.length > (language === 'zh' ? 8 : 15))).toBe(true)
      }
    }
  })

  it('gives every tool a unique English overview', () => {
    const overviews = tools.map((tool) => toolEditorial[tool.id].en.overview)
    expect(new Set(overviews).size).toBe(tools.length)
  })
})
