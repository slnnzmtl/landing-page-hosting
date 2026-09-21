import { describe, it, expect } from 'vitest'
import { mapPortfolio } from '~/utils/cms/map'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'

const BASE = { baseUrl: 'https://cms.example.test' }
const { products } = mapPortfolio(cmsPortfolioFixture, BASE)
const sampleConverter = products[0]

describe('product mapping (CMS-mapped)', () => {
  it('passes through public product name and slug', () => {
    expect(sampleConverter.slug).toBe('sample-converter')
    expect(sampleConverter.name).toBe('Sample Converter')
  })

  it('passes through benefits, stack tags, and guide steps', () => {
    expect(sampleConverter.benefits?.map(b => b.title)).toEqual([
      'Lossless input',
      'WAV and AIFF output',
    ])
    expect(sampleConverter.stackTags).toContain('Python')
    expect(sampleConverter.guide?.title).toBe('How to use')
    expect(sampleConverter.guide?.steps).toHaveLength(2)
    expect(sampleConverter.guide?.warning).toMatch(/Imported Library/)
  })

  it('passes through launch CTAs and trust facts', () => {
    expect(sampleConverter.launch?.macosDownloadWarning).toMatch(/ad hoc signed/)
    expect(sampleConverter.launch?.ctas.map(cta => cta.label)).toEqual([
      'Download for macOS',
      'Other platforms',
    ])
    expect(sampleConverter.launch?.ctas[0].macosDownload).toBe(true)
    expect(sampleConverter.launch?.trustFacts.map(fact => fact.label)).toEqual(
      expect.arrayContaining(['License', 'Privacy', 'Issues']),
    )
    expect(sampleConverter.seo?.titleSuffix).toBe('Ada Example')
  })

  it('does not hardcode a current version or release date', () => {
    const blob = JSON.stringify(sampleConverter)
    expect(blob).not.toMatch(/v\d+\.\d+\.\d+/)
  })

  it('maps logo and walkthrough screenshots from Directus file titles', () => {
    expect(sampleConverter.logo?.src).toBe(
      '/projects/sample-converter/sample-converter-logo.webp',
    )
    expect(sampleConverter.logo?.srcThumb).toMatch(/-256w\.webp/)
    expect(sampleConverter.gallery).toBeUndefined()
    const images = sampleConverter.guide?.steps
      .map(step => step.image)
      .filter(Boolean) || []
    expect(images).toHaveLength(1)
    images.forEach((image) => {
      expect(image?.src).toMatch(/^\/projects\/sample-converter\//)
      expect(image?.srcThumb).toMatch(/-600w\.webp/)
    })
  })
})
