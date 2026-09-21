import { describe, it, expect } from 'vitest'
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
import { mapPortfolio } from '~/utils/cms/map'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'

const BASE = { baseUrl: 'https://cms.kazansky.dev' }
const { homepage, products } = mapPortfolio(cmsPortfolioFixture, BASE)
const rekordboxPlaylistConverter = products[0]

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
    expect(absoluteUrl('https://kazansky.dev', '/products')).toBe(
      'https://kazansky.dev/products',
    )
  })
})

describe('projects SEO documents', () => {
  const siteUrl = DEFAULT_SITE_URL

  it('builds indexable CollectionPage + ItemList JSON-LD for /products', () => {
    const page = projectsIndexSeo(siteUrl, products, {
      siteName: homepage.siteName,
      title: homepage.pageCopy.products_index.title,
      description: homepage.pageCopy.products_index.seo_description,
    })
    expect(page.robots).toBe('index, follow')
    expect(page.description).toBe(homepage.pageCopy.products_index.seo_description)
    expect(page.jsonLd['@type']).toBe('CollectionPage')
    const main = page.jsonLd.mainEntity as { '@type': string, 'itemListElement': unknown[] }
    expect(main['@type']).toBe('ItemList')
    expect(main.itemListElement.length).toBe(products.length)
    const blob = JSON.stringify(page.jsonLd)
    expect(blob).not.toMatch(/aggregateRating/)
    expect(blob).not.toMatch(/"offers"/)
  })

  it('uses a personal portfolio suffix on the converter product title', () => {
    const page = projectDetailSeo(siteUrl, rekordboxPlaylistConverter, {
      siteName: homepage.siteName,
      personName: homepage.person.name,
    })
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
      { rel: 'canonical', href: `${siteUrl}/products/rekordbox-playlist-converter` },
    ])
    expect(head.meta).toEqual(expect.arrayContaining([
      { name: 'robots', content: 'index, follow' },
      { property: 'og:image', content: absoluteUrl(siteUrl, rekordboxPlaylistConverter.socialImage!.src) },
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
    const page = homepageSeo(DEFAULT_SITE_URL, homepage)
    expect(page.robots).toBe('index, follow')
    expect(page.path).toBe('/')
    expect(page.ogType).toBe('website')
    expect(page.title).toBe('Daniel Kazansky | AI-Native Full-Stack Engineer')
    expect(page.description).toBe(homepage.seoDescription)

    const graph = page.jsonLd['@graph'] as Array<Record<string, unknown>>
    const types = graph.map(node => node['@type'])
    expect(types).toEqual(['WebSite', 'Person', 'ItemList'])

    const website = graph.find(node => node['@type'] === 'WebSite') as {
      name: string
      publisher: { '@id': string }
    }
    const person = graph.find(node => node['@type'] === 'Person') as {
      '@id': string
      'name': string
      'sameAs': string[]
    }
    expect(website.name).toBe(homepage.siteName)
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
        'https://github.com/slnnzmtl/directus-website-builder',
        'https://kazansky.dev/products/rekordbox-playlist-converter',
      ]),
    )
    expect(list.itemListElement.map(entry => entry.item.url)).not.toContain(
      'https://kazansky.dev/#contact',
    )

    const head = seoHead(DEFAULT_SITE_URL, page, homepage.siteName)
    expect(head.link).toEqual([{ rel: 'canonical', href: 'https://kazansky.dev/' }])
    expect(head.meta).toEqual(expect.arrayContaining([
      { name: 'robots', content: 'index, follow' },
      { property: 'og:site_name', content: 'Kazansky.dev' },
      { property: 'og:url', content: 'https://kazansky.dev/' },
      { property: 'og:type', content: 'website' },
    ]))
    expect(JSON.stringify(head.meta)).not.toMatch(/noindex/)
  })
})

describe('experience page SEO', () => {
  it('builds indexable ProfilePage + Person JSON-LD for /experience', () => {
    const page = experiencePageSeo(
      DEFAULT_SITE_URL,
      {
        name: 'Daniel Kazansky',
        role: 'AI-Native Full-Stack Engineer',
        sameAs: [
          'https://github.com/slnnzmtl',
          'https://www.linkedin.com/in/daniel-kazansky/',
        ],
      },
      {
        siteName: homepage.siteName,
        title: `${homepage.pageCopy.experience.title} | Daniel Kazansky`,
        description: homepage.pageCopy.experience.seo_description,
      },
    )
    expect(page.robots).toBe('index, follow')
    expect(page.path).toBe('/experience')
    expect(page.ogType).toBe('profile')
    expect(page.description).toBe(homepage.pageCopy.experience.seo_description)
    const types = (page.jsonLd['@graph'] as Array<Record<string, unknown>>).map(
      node => node['@type'],
    )
    expect(types).toEqual(['ProfilePage', 'Person'])
    const personNode = (page.jsonLd['@graph'] as Array<Record<string, unknown>>)
      .find(node => node['@type'] === 'Person') as { '@id': string }
    expect(personNode['@id']).toBe('https://kazansky.dev/#person')
    const head = seoHead(DEFAULT_SITE_URL, page, homepage.siteName)
    expect(head.link).toEqual([
      { rel: 'canonical', href: `${DEFAULT_SITE_URL}/experience` },
    ])
  })
})

describe('sitemap and robots', () => {
  it('lists the homepage, experience page, products index, and every registered product', () => {
    const slugs = products.map(p => p.slug)
    const xml = buildSitemapXml(DEFAULT_SITE_URL, undefined, slugs)
    expect(sitemapPaths(slugs)).toContain('/')
    expect(sitemapPaths(slugs)).toContain('/experience')
    expect(sitemapPaths(slugs)).toContain('/products')
    expect(sitemapPaths(slugs)).toContain('/products/rekordbox-playlist-converter')
    expect(xml).toContain('<loc>https://kazansky.dev/</loc>')
    expect(xml).toContain('<loc>https://kazansky.dev/experience</loc>')
    expect(xml).toContain('<loc>https://kazansky.dev/products</loc>')
    expect(xml).toContain('<loc>https://kazansky.dev/products/rekordbox-playlist-converter</loc>')
  })

  it('allows crawlers on /products and points at the sitemap', () => {
    const robots = buildRobotsTxt(DEFAULT_SITE_URL)
    expect(robots).toContain('Allow: /products')
    expect(robots).toContain('Sitemap: https://kazansky.dev/sitemap.xml')
    expect(robots).toContain('Disallow: /finance')
  })
})
