import { describe, it, expect } from 'vitest'
import { mapPortfolio } from '~/utils/cms/map'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'

const BASE = { baseUrl: 'https://cms.kazansky.dev' }
const { products } = mapPortfolio(cmsPortfolioFixture, BASE)
const rekordboxPlaylistConverter = products[0]

describe('Simple Rekordbox Converter product data (CMS-mapped)', () => {
  it('uses the public product name and slug', () => {
    expect(rekordboxPlaylistConverter.slug).toBe('rekordbox-playlist-converter')
    expect(rekordboxPlaylistConverter.name).toBe('Simple Rekordbox Converter')
  })

  it('documents feature highlights and stack tags', () => {
    const titles = rekordboxPlaylistConverter.benefits?.map(b => b.title).join(' ') || ''
    expect(titles).toMatch(/Rekordbox 6 and 7/)
    expect(titles).toMatch(/WAV and AIFF/)
    expect(titles).toMatch(/GitHub Actions/)
    expect(rekordboxPlaylistConverter.stackTags).toContain('Python')
    expect(rekordboxPlaylistConverter.stackTags).toContain('FFmpeg')
  })

  it('documents the How to use walkthrough and File → Import warning', () => {
    const guide = rekordboxPlaylistConverter.guide
    expect(guide?.title).toBe('How to use')
    expect(guide?.steps).toHaveLength(5)
    expect(guide?.warning).toMatch(/File → Import/)
    expect(guide?.warning).toMatch(/Imported Library/)
    expect(guide?.steps[0].title).toBe('Export from Rekordbox')
    expect(guide?.steps[0].body).toMatch(/Export Collection/)
    expect(guide?.steps[1].title).toBe('Convert in the app')
    expect(guide?.steps[1].body).toMatch(/rekordbox-import\.xml/)
    expect(guide?.steps[2].title).toBe('Confirm the preview')
    expect(guide?.steps[3].title).toBe('Import into Rekordbox')
    expect(guide?.steps[3].body).toMatch(/Imported Library/)
    expect(guide?.steps[3].body).toMatch(/rekordbox xml/)
    expect(guide?.steps[4].title).toBe('Edit Import XML')
  })

  it('warns about ad hoc signing before macOS download', () => {
    expect(rekordboxPlaylistConverter.launch?.macosDownloadWarning).toMatch(/ad hoc signed/)
  })

  it('exposes launch CTAs for macOS download and other platforms', () => {
    const labels = rekordboxPlaylistConverter.launch?.ctas.map(cta => cta.label) || []
    expect(labels).toEqual([
      'Download for macOS',
      'Other platforms',
    ])
    const hrefs = rekordboxPlaylistConverter.launch?.ctas.map(cta => cta.href) || []
    expect(hrefs).toEqual([
      'https://github.com/slnnzmtl/rekordbox-playlist-converter/releases',
      'https://github.com/slnnzmtl/rekordbox-playlist-converter/releases',
    ])
    expect(rekordboxPlaylistConverter.launch?.ctas[0].macosDownload).toBe(true)
  })

  it('documents product trust facts and trademark disclaimer', () => {
    const labels = rekordboxPlaylistConverter.launch?.trustFacts.map(fact => fact.label) || []
    expect(labels).toContain('License')
    expect(labels).toContain('Privacy')
    expect(labels).toContain('Issues')
    expect(rekordboxPlaylistConverter.launch?.trademark).toMatch(/Rekordbox is a trademark/)
    expect(rekordboxPlaylistConverter.seo?.titleSuffix).toBe('Daniel Kazansky')
  })

  it('does not hardcode a current version or release date', () => {
    const blob = JSON.stringify(rekordboxPlaylistConverter)
    expect(blob).not.toMatch(/v\d+\.\d+\.\d+/)
    expect(blob).not.toMatch(/1\.2\.0/)
  })

  it('maps logo and walkthrough screenshots from Directus file titles', () => {
    expect(rekordboxPlaylistConverter.logo?.src).toBe(
      '/projects/rekordbox-playlist-converter/simple-rekordbox-converter-logo.webp',
    )
    expect(rekordboxPlaylistConverter.logo?.srcThumb).toMatch(/-256w\.webp/)
    expect(rekordboxPlaylistConverter.logo?.srcset).toContain('256w')
    expect(rekordboxPlaylistConverter.gallery).toBeUndefined()
    const images = rekordboxPlaylistConverter.guide?.steps
      .map(step => step.image)
      .filter(Boolean) || []
    expect(images).toHaveLength(3)
    images.forEach((image) => {
      expect(image?.src).toMatch(/^\/projects\/rekordbox-playlist-converter\//)
      expect(image?.src).not.toMatch(/raw\.githubusercontent/)
      expect(image?.srcThumb).toMatch(/-600w\.webp/)
      expect(image?.srcset).toContain('600w')
    })
  })
})
