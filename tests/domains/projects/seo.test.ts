import { describe, it, expect } from 'vitest'
import { rekordboxPlaylistConverter } from '~/domains/projects/data/rekordbox-playlist-converter'
import { projects } from '~/domains/projects/data/registry'
import {
  DEFAULT_SITE_URL,
  absoluteUrl,
  buildRobotsTxt,
  buildSitemapXml,
  experiencePageSeo,
  homepageSeo,
  projectDetailSeo,
  projectsIndexSeo,
  resolveSiteUrl,
  seoHead,
  sitemapPaths,
} from '~/domains/projects/utils/seo'
import { homepageContent } from '~/data/homepage'

describe('site origin', () => {
  it('defaults to the production origin, not a Vercel preview host', () => {
    expect(resolveSiteUrl()).toBe(DEFAULT_SITE_URL)
    expect(resolveSiteUrl('')).toBe(DEFAULT_SITE_URL)
    expect(DEFAULT_SITE_URL).toBe('https://kazansky.dev')
    expect(DEFAULT_SITE_URL).not.toMatch(/vercel\.app\/.*-/)
  })

  it('strips trailing slashes from a configured origin', () => {
    expect(resolveSiteUrl('https://kazansky.dev/')).toBe('https://kazansky.dev')
  })

  it('builds absolute URLs from the configured origin', () => {
    expect(absoluteUrl('https://kazansky.dev', '/projects')).toBe(
      'https://kazansky.dev/projects',
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

describe('homepage SEO', () => {
  it('builds an indexable homepage with Person, WebSite, and CreativeWork JSON-LD', () => {
    const page = homepageSeo(DEFAULT_SITE_URL, homepageContent)
    expect(page.robots).toBe('index, follow')
    expect(page.path).toBe('/')
    expect(page.ogType).toBe('website')
    expect(page.title).toBe('Daniel Kazansky | AI-Native Full-Stack Engineer')

    const graph = page.jsonLd['@graph'] as Array<Record<string, unknown>>
    const types = graph.map(node => node['@type'])
    expect(types).toEqual(['WebSite', 'Person', 'ItemList'])

    const website = graph.find(node => node['@type'] === 'WebSite') as {
      publisher: { '@id': string }
    }
    const person = graph.find(node => node['@type'] === 'Person') as {
      '@id': string
      'name': string
      'sameAs': string[]
    }
    expect(person.name).toBe('Daniel Kazansky')
    expect(person['@id']).toBe('https://kazansky.dev/#person')
    expect(website.publisher['@id']).toBe(person['@id'])
    expect(person.sameAs).toContain('https://github.com/slnnzmtl')

    const list = graph.find(node => node['@type'] === 'ItemList') as {
      itemListElement: Array<{ item: { '@type': string, 'url': string } }>
    }
    expect(list.itemListElement.length).toBeGreaterThan(0)
    expect(list.itemListElement.every(entry => entry.item['@type'] === 'CreativeWork')).toBe(true)
    expect(list.itemListElement.map(entry => entry.item.url)).toEqual(
      expect.arrayContaining([
        'https://github.com/slnnzmtl/langgraph-appointment-bot',
        'https://kazansky.dev/projects/rekordbox-playlist-converter',
      ]),
    )
    expect(list.itemListElement.map(entry => entry.item.url)).not.toContain(
      'https://kazansky.dev/#contact',
    )

    const head = seoHead(DEFAULT_SITE_URL, page)
    expect(head.link).toEqual([{ rel: 'canonical', href: 'https://kazansky.dev/' }])
    expect(head.meta).toEqual(expect.arrayContaining([
      { name: 'robots', content: 'index, follow' },
      { property: 'og:url', content: 'https://kazansky.dev/' },
      { property: 'og:type', content: 'website' },
    ]))
    expect(JSON.stringify(head.meta)).not.toMatch(/noindex/)
  })
})

describe('experience page SEO', () => {
  it('builds indexable ProfilePage + Person JSON-LD for /experience', () => {
    const page = experiencePageSeo(DEFAULT_SITE_URL, {
      name: 'Daniel Kazansky',
      role: 'AI-Native Full-Stack Engineer',
      sameAs: [
        'https://github.com/slnnzmtl',
        'https://www.linkedin.com/in/daniel-kazansky/',
      ],
    })
    expect(page.robots).toBe('index, follow')
    expect(page.path).toBe('/experience')
    expect(page.ogType).toBe('profile')
    const types = (page.jsonLd['@graph'] as Array<Record<string, unknown>>).map(
      node => node['@type'],
    )
    expect(types).toEqual(['ProfilePage', 'Person'])
    const personNode = (page.jsonLd['@graph'] as Array<Record<string, unknown>>)
      .find(node => node['@type'] === 'Person') as { '@id': string }
    expect(personNode['@id']).toBe('https://kazansky.dev/#person')
    const head = seoHead(DEFAULT_SITE_URL, page)
    expect(head.link).toEqual([
      { rel: 'canonical', href: `${DEFAULT_SITE_URL}/experience` },
    ])
  })
})

describe('sitemap and robots', () => {
  it('lists the homepage, experience page, projects index, and every registered project', () => {
    const xml = buildSitemapXml(DEFAULT_SITE_URL)
    expect(sitemapPaths()).toContain('/')
    expect(sitemapPaths()).toContain('/experience')
    expect(sitemapPaths()).toContain('/projects')
    expect(sitemapPaths()).toContain('/projects/rekordbox-playlist-converter')
    expect(xml).toContain('<loc>https://kazansky.dev/</loc>')
    expect(xml).toContain('<loc>https://kazansky.dev/experience</loc>')
    expect(xml).toContain('<loc>https://kazansky.dev/projects</loc>')
    expect(xml).toContain('<loc>https://kazansky.dev/projects/rekordbox-playlist-converter</loc>')
  })

  it('allows crawlers on /projects and points at the sitemap', () => {
    const robots = buildRobotsTxt(DEFAULT_SITE_URL)
    expect(robots).toContain('Allow: /projects')
    expect(robots).toContain('Sitemap: https://kazansky.dev/sitemap.xml')
    expect(robots).toContain('Disallow: /finance')
  })
})
