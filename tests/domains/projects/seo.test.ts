import { describe, it, expect } from 'vitest'
import { rekordboxPlaylistConverter } from '~/domains/projects/data/rekordbox-playlist-converter'
import { projects } from '~/domains/projects/data/registry'
import {
  DEFAULT_SITE_URL,
  absoluteUrl,
  buildRobotsTxt,
  buildSitemapXml,
  projectDetailSeo,
  projectsIndexSeo,
  resolveSiteUrl,
  seoHead,
  sitemapPaths,
} from '~/domains/projects/utils/seo'

describe('site origin', () => {
  it('defaults to the production origin, not a Vercel preview host', () => {
    expect(resolveSiteUrl()).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl('')).toBe(DEFAULT_SITE_URL)
    expect(DEFAULT_SITE_URL).toBe('https://landing-hosting.vercel.app')
    expect(DEFAULT_SITE_URL).not.toMatch(/vercel\.app\/.*-/)
  })

  it('strips trailing slashes from a configured origin', () => {
    expect(resolveSiteUrl('https://kazansky.dev/')).toBe('https://kazansky.dev')
  })

  it('builds absolute URLs from the configured origin', () => {
    expect(absoluteUrl('https://landing-hosting.vercel.app', '/projects')).toBe(
      'https://landing-hosting.vercel.app/projects',
    )
  })
})

describe('projects SEO documents', () => {
  const siteUrl = DEFAULT_SITE_URL

  it('builds indexable CollectionPage + ItemList JSON-LD for /projects', () => {
    const page = projectsIndexSeo(siteUrl, projects)
    expect(page.robots).toBe('index, follow')
    expect(page.jsonLd['@type']).toBe('CollectionPage')
    const main = page.jsonLd.mainEntity as { '@type': string, 'itemListElement': unknown[] }
    expect(main['@type']).toBe('ItemList')
    expect(main.itemListElement.length).toBe(projects.length)
    const blob = JSON.stringify(page.jsonLd)
    expect(blob).not.toMatch(/aggregateRating/)
    expect(blob).not.toMatch(/"offers"/)
  })

  it('uses a personal portfolio suffix on the converter product title', () => {
    const page = projectDetailSeo(siteUrl, rekordboxPlaylistConverter)
    expect(page.title).toBe('Simple Rekordbox Converter | Daniel Kazansky')
  })

  it('builds SoftwareApplication + BreadcrumbList JSON-LD for the converter', () => {
    const page = projectDetailSeo(siteUrl, rekordboxPlaylistConverter)
    const graph = (page.jsonLd['@graph'] as Array<Record<string, unknown>>).map(node => node['@type'])
    expect(graph).toContain('SoftwareApplication')
    expect(graph).toContain('BreadcrumbList')
    const blob = JSON.stringify(page.jsonLd)
    expect(blob).not.toMatch(/aggregateRating/)
    expect(blob).not.toMatch(/reviewRating/)
    expect(blob).not.toMatch(/v1\.2\.0/)
  })

  it('emits canonical, robots, and absolute social tags', () => {
    const page = projectDetailSeo(siteUrl, rekordboxPlaylistConverter)
    const head = seoHead(siteUrl, page)
    expect(head.link).toEqual([
      { rel: 'canonical', href: `${siteUrl}/projects/rekordbox-playlist-converter` },
    ])
    expect(head.meta).toEqual(expect.arrayContaining([
      { name: 'robots', content: 'index, follow' },
      { property: 'og:image', content: `${siteUrl}${rekordboxPlaylistConverter.socialImage?.src}` },
      { name: 'twitter:card', content: 'summary_large_image' },
    ]))
  })

  it('escapes < in JSON-LD so script tags cannot break out', () => {
    const page = projectDetailSeo(siteUrl, {
      ...rekordboxPlaylistConverter,
      name: 'App</script><script>alert(1)',
      seo: {
        title: 'App</script>',
        description: 'Desc</script><img src=x>',
      },
    })
    const head = seoHead(siteUrl, page)
    const script = head.script?.[0] as { innerHTML?: string }
    expect(script.innerHTML).toContain('\\u003c')
    expect(script.innerHTML).not.toMatch(/<\/script>/i)
  })
})

describe('sitemap and robots', () => {
  it('lists the homepage, experience page, projects index, and every registered project', () => {
    const xml = buildSitemapXml(DEFAULT_SITE_URL)
    expect(sitemapPaths()).toContain('/')
    expect(sitemapPaths()).toContain('/experience')
    expect(sitemapPaths()).toContain('/projects')
    expect(sitemapPaths()).toContain('/projects/rekordbox-playlist-converter')
    expect(xml).toContain('<loc>https://landing-hosting.vercel.app/</loc>')
    expect(xml).toContain('<loc>https://landing-hosting.vercel.app/experience</loc>')
    expect(xml).toContain('<loc>https://landing-hosting.vercel.app/projects</loc>')
    expect(xml).toContain('<loc>https://landing-hosting.vercel.app/projects/rekordbox-playlist-converter</loc>')
  })

  it('allows crawlers on /projects and points at the sitemap', () => {
    const robots = buildRobotsTxt(DEFAULT_SITE_URL)
    expect(robots).toContain('Allow: /projects')
    expect(robots).toContain('Sitemap: https://landing-hosting.vercel.app/sitemap.xml')
    expect(robots).toContain('Disallow: /finance')
  })
})
