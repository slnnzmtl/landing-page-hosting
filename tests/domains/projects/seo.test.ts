import { describe, it, expect } from 'vitest'
import {
  DEFAULT_SITE_URL,
  absoluteUrl,
  buildRobotsTxt,
  buildSitemapXml,
  experiencePageSeo,
  homepageSeo,
  resolveSiteUrl,
  seoHead,
  sitemapPaths,
} from '~/utils/seo'
import {
  projectDetailSeo,
  projectsIndexSeo,
} from '~/domains/projects/utils/project-seo'
import { mapPortfolio } from '~/utils/cms/map'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'

const BASE = { baseUrl: 'https://cms.example.test' }
const { homepage, products, experiencePage } = mapPortfolio(cmsPortfolioFixture, BASE)
const sampleConverter = products[0]

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
    expect(page.jsonLd.description).toBe(homepage.pageCopy.products_index.seo_description)
    const main = page.jsonLd.mainEntity as { '@type': string, 'itemListElement': unknown[] }
    expect(main['@type']).toBe('ItemList')
    expect(main.itemListElement.length).toBe(products.length)
    const blob = JSON.stringify(page.jsonLd)
    expect(blob).not.toMatch(/aggregateRating/)
    expect(blob).not.toMatch(/"offers"/)
  })

  it('requires CMS siteName and description for the products index', () => {
    expect(() =>
      projectsIndexSeo(siteUrl, products, {
        siteName: '',
        description: homepage.pageCopy.products_index.seo_description,
      }),
    ).toThrow(/siteName/)
    expect(() =>
      projectsIndexSeo(siteUrl, products, {
        siteName: homepage.siteName,
        description: '',
      }),
    ).toThrow(/description/)
  })

  it('uses the CMS title suffix on the product detail title', () => {
    const page = projectDetailSeo(siteUrl, sampleConverter, {
      siteName: homepage.siteName,
      personName: homepage.person.name,
    })
    expect(page.title).toBe('Sample Converter | Ada Example')
  })

  it('requires CMS siteName and personName for product detail', () => {
    expect(() =>
      projectDetailSeo(siteUrl, sampleConverter, {
        siteName: '',
        personName: homepage.person.name,
      }),
    ).toThrow(/siteName/)
    expect(() =>
      projectDetailSeo(siteUrl, sampleConverter, {
        siteName: homepage.siteName,
        personName: '',
      }),
    ).toThrow(/personName/)
  })

  it('builds SoftwareApplication + BreadcrumbList JSON-LD for the product', () => {
    const page = projectDetailSeo(siteUrl, sampleConverter, {
      siteName: homepage.siteName,
      personName: homepage.person.name,
    })
    const graph = (page.jsonLd['@graph'] as Array<Record<string, unknown>>).map(node => node['@type'])
    expect(graph).toContain('SoftwareApplication')
    expect(graph).toContain('BreadcrumbList')
    const blob = JSON.stringify(page.jsonLd)
    expect(blob).not.toMatch(/aggregateRating/)
    expect(blob).not.toMatch(/reviewRating/)
  })

  it('emits canonical, robots, and absolute social tags', () => {
    const page = projectDetailSeo(siteUrl, sampleConverter, {
      siteName: homepage.siteName,
      personName: homepage.person.name,
    })
    const head = seoHead(siteUrl, page, homepage.siteName)
    expect(head.link).toEqual([
      { rel: 'canonical', href: `${siteUrl}/products/sample-converter` },
    ])
    expect(head.meta).toEqual(expect.arrayContaining([
      { name: 'robots', content: 'index, follow' },
      { property: 'og:image', content: absoluteUrl(siteUrl, sampleConverter.socialImage!.src) },
      { name: 'twitter:card', content: 'summary_large_image' },
    ]))
  })

  it('escapes < in JSON-LD so script tags cannot break out', () => {
    const page = projectDetailSeo(siteUrl, {
      ...sampleConverter,
      name: 'App</script><script>alert(1)',
      seo: {
        title: 'App</script>',
        description: 'Desc</script><img src=x>',
      },
    }, {
      siteName: homepage.siteName,
      personName: homepage.person.name,
    })
    const head = seoHead(siteUrl, page, homepage.siteName)
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
    expect(page.title).toBe(homepage.seoTitle)
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
    expect(person.name).toBe(homepage.person.name)
    expect(person['@id']).toBe('https://kazansky.dev/#person')
    expect(website.publisher['@id']).toBe(person['@id'])
    expect(person.sameAs).toContain('https://github.com/example-org')

    const list = graph.find(node => node['@type'] === 'ItemList') as {
      itemListElement: Array<{ item: { '@type': string, 'url': string } }>
    }
    expect(list.itemListElement.length).toBeGreaterThan(0)
    expect(list.itemListElement.every(entry => entry.item['@type'] === 'CreativeWork')).toBe(true)
    expect(list.itemListElement.map(entry => entry.item.url)).toEqual(
      expect.arrayContaining([
        'https://kazansky.dev/work/sample-flagship-case',
        'https://kazansky.dev/products/sample-converter',
      ]),
    )
    expect(list.itemListElement.map(entry => entry.item.url)).not.toContain(
      'https://kazansky.dev/#contact',
    )

    const head = seoHead(DEFAULT_SITE_URL, page, homepage.siteName)
    expect(head.link).toEqual([{ rel: 'canonical', href: 'https://kazansky.dev/' }])
    expect(head.meta).toEqual(expect.arrayContaining([
      { name: 'robots', content: 'index, follow' },
      { property: 'og:site_name', content: homepage.siteName },
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
        name: homepage.person.name,
        role: homepage.person.role,
        sameAs: homepage.profileLinks.map(link => link.href),
      },
      {
        siteName: homepage.siteName,
        title: `${experiencePage.title} | ${homepage.person.name}`,
        description: experiencePage.seo_description,
      },
    )
    expect(page.robots).toBe('index, follow')
    expect(page.path).toBe('/experience')
    expect(page.ogType).toBe('profile')
    expect(page.description).toBe(experiencePage.seo_description)
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

  it('requires CMS siteName, title, and description', () => {
    expect(() =>
      experiencePageSeo(
        DEFAULT_SITE_URL,
        { name: homepage.person.name, role: homepage.person.role, sameAs: [] },
        { siteName: '', title: 'Title', description: 'Desc' },
      ),
    ).toThrow(/siteName/)
  })
})

describe('sitemap and robots', () => {
  it('lists the homepage, experience page, products, and case routes', () => {
    const productSlugs = products.map(p => p.slug)
    const caseSlugs = ['sample-flagship-case']
    const xml = buildSitemapXml(DEFAULT_SITE_URL, undefined, productSlugs, caseSlugs)
    expect(sitemapPaths(productSlugs, caseSlugs)).toContain('/')
    expect(sitemapPaths(productSlugs, caseSlugs)).toContain('/experience')
    expect(sitemapPaths(productSlugs, caseSlugs)).toContain('/products')
    expect(sitemapPaths(productSlugs, caseSlugs)).toContain('/products/sample-converter')
    expect(sitemapPaths(productSlugs, caseSlugs)).toContain('/work/sample-flagship-case')
    expect(xml).toContain('<loc>https://kazansky.dev/</loc>')
    expect(xml).toContain('<loc>https://kazansky.dev/experience</loc>')
    expect(xml).toContain('<loc>https://kazansky.dev/products</loc>')
    expect(xml).toContain('<loc>https://kazansky.dev/products/sample-converter</loc>')
    expect(xml).toContain('<loc>https://kazansky.dev/work/sample-flagship-case</loc>')
  })

  it('allows crawlers on /products and points at the sitemap', () => {
    const robots = buildRobotsTxt(DEFAULT_SITE_URL)
    expect(robots).toContain('Allow: /products')
    expect(robots).toContain('Sitemap: https://kazansky.dev/sitemap.xml')
    expect(robots).toContain('Disallow: /finance')
  })
})
