import { describe, it, expect } from 'vitest'
import { rekordboxPlaylistConverter } from '~/domains/projects/data/rekordbox-playlist-converter'

describe('Simple Rekordbox Converter product data', () => {
  it('uses the public product name and slug', () => {
    expect(rekordboxPlaylistConverter.slug).toBe('rekordbox-playlist-converter')
    expect(rekordboxPlaylistConverter.name).toBe('Simple Rekordbox Converter')
  })

  it('covers the required evergreen benefits', () => {
    const titles = rekordboxPlaylistConverter.benefits?.map(b => b.title).join(' ') || ''
    expect(titles).toMatch(/Rekordbox 6 and 7/)
    expect(titles).toMatch(/Originals stay untouched/)
    expect(titles).toMatch(/WAV or AIFF/)
    expect(titles).toMatch(/Cues, beatgrid, and metadata/)
  })

  it('documents the three-step import path and File → Import warning', () => {
    const guide = rekordboxPlaylistConverter.guide
    expect(guide?.steps).toHaveLength(3)
    expect(guide?.warning).toMatch(/File → Import/)
    expect(guide?.steps[0].body).toMatch(/Export Collection/)
    expect(guide?.steps[1].title).toMatch(/macOS app/)
    expect(guide?.steps[2].body).toMatch(/Imported Library/)
    expect(guide?.steps[2].body).toMatch(/rekordbox xml/)
  })

  it('links to source, usage docs, and GitHub releases', () => {
    const hrefs = rekordboxPlaylistConverter.links?.map(link => link.href) || []
    expect(hrefs).toContain('https://github.com/slnnzmtl/rekordbox-playlist-converter')
    expect(hrefs).toContain('https://github.com/slnnzmtl/rekordbox-playlist-converter/blob/master/USAGE.md')
    expect(hrefs).toContain('https://github.com/slnnzmtl/rekordbox-playlist-converter/releases')
  })

  it('does not hardcode a current version or release date', () => {
    const blob = JSON.stringify(rekordboxPlaylistConverter)
    expect(blob).not.toMatch(/v\d+\.\d+\.\d+/)
    expect(blob).not.toMatch(/1\.2\.0/)
  })

  it('hosts a local logo and at least three captioned screenshots', () => {
    expect(rekordboxPlaylistConverter.logo?.src).toMatch(/^\/projects\//)
    expect(rekordboxPlaylistConverter.logo?.src).not.toMatch(/raw\.githubusercontent/)
    expect(rekordboxPlaylistConverter.logo?.srcThumb).toMatch(/-256w\.webp$/)
    expect(rekordboxPlaylistConverter.logo?.srcset).toContain('256w')
    expect(rekordboxPlaylistConverter.gallery?.length).toBeGreaterThanOrEqual(3)
    rekordboxPlaylistConverter.gallery?.forEach((image) => {
      expect(image.src).toMatch(/^\/projects\//)
      expect(image.src).not.toMatch(/raw\.githubusercontent/)
      expect(image.srcThumb).toMatch(/-600w\.webp$/)
      expect(image.srcset).toContain('600w')
      expect(image.sizes).toBeTruthy()
      expect(image.alt.length).toBeGreaterThan(8)
      expect(image.caption?.length).toBeGreaterThan(8)
      expect(image.width).toBeGreaterThan(0)
      expect(image.height).toBeGreaterThan(0)
    })
  })
})
