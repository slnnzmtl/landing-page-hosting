export const DEFAULT_SITE_URL = 'https://kazansky.dev'
/** Fallback when a caller has no CMS site_name (error page, unit tests). */
export const SITE_NAME = 'Kazansky.dev'

export interface PageSeo {
  title: string
  description: string
  path: string
  robots: string
  ogType: 'website' | 'article' | 'profile'
  image?: { src: string, alt: string, width: number, height: number }
  jsonLd: Record<string, unknown>
}

export function resolveSiteUrl(raw?: string | null): string {
  const value = (raw || DEFAULT_SITE_URL).trim().replace(/\/+$/, '')
  if (!/^https?:\/\//i.test(value)) return DEFAULT_SITE_URL
  return value
}

export function absoluteUrl(siteUrl: string, path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const origin = resolveSiteUrl(siteUrl)
  if (!path || path === '/') return `${origin}/`
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

export function personId(siteUrl: string): string {
  return `${absoluteUrl(siteUrl, '/')}#person`
}

export function websiteId(siteUrl: string): string {
  return `${absoluteUrl(siteUrl, '/')}#website`
}

export interface HomepageSeoInput {
  person: {
    name: string
    role: string
  }
  valueProposition: string
  profileLinks: Array<{ href: string }>
  featuredCases: Array<{ title: string, href: string }>
  products: { items: Array<{ title: string, cta: { href: string } }> }
  siteName?: string
  seoTitle?: string
  seoDescription?: string
}

function isPublicCreativeWorkHref(href: string): boolean {
  return /^(?:https?:|\/(?!\/))/i.test(href) && !href.startsWith('#')
}

function homepageCreativeWorks(
  siteUrl: string,
  home: HomepageSeoInput,
): Array<{ '@type': 'CreativeWork', 'name': string, 'url': string }> {
  const works: Array<{ '@type': 'CreativeWork', 'name': string, 'url': string }> = []
  const seen = new Set<string>()

  for (const item of home.featuredCases) {
    if (!isPublicCreativeWorkHref(item.href)) continue
    const url = absoluteUrl(siteUrl, item.href)
    if (seen.has(url)) continue
    seen.add(url)
    works.push({ '@type': 'CreativeWork', 'name': item.title, 'url': url })
  }

  for (const product of home.products.items) {
    if (!isPublicCreativeWorkHref(product.cta.href)) continue
    const url = absoluteUrl(siteUrl, product.cta.href)
    if (seen.has(url)) continue
    seen.add(url)
    works.push({ '@type': 'CreativeWork', 'name': product.title, 'url': url })
  }

  return works
}

export function homepageSeo(siteUrl: string, home: HomepageSeoInput): PageSeo {
  const path = '/'
  const url = absoluteUrl(siteUrl, path)
  const siteName = home.siteName || SITE_NAME
  const title = home.seoTitle || `${home.person.name} | ${home.person.role}`
  const description = home.seoDescription || home.valueProposition
  const creativeWorks = homepageCreativeWorks(siteUrl, home)
  const person = personId(siteUrl)
  const website = websiteId(siteUrl)
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': website,
      'name': siteName,
      'url': url,
      'publisher': { '@id': person },
    },
    {
      '@type': 'Person',
      '@id': person,
      'name': home.person.name,
      'jobTitle': home.person.role,
      'url': url,
      'sameAs': home.profileLinks.map(link => link.href),
    },
  ]
  if (creativeWorks.length) {
    graph.push({
      '@type': 'ItemList',
      'name': 'Selected work and products',
      'itemListElement': creativeWorks.map((work, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': work,
      })),
    })
  }

  return {
    title,
    description,
    path,
    robots: 'index, follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': graph,
    },
  }
}

export interface ExperiencePagePerson {
  name: string
  role: string
  sameAs: string[]
}

export interface ExperiencePageSeoOptions {
  siteName: string
  title: string
  description: string
}

export function experiencePageSeo(
  siteUrl: string,
  person: ExperiencePagePerson,
  options: ExperiencePageSeoOptions,
): PageSeo {
  if (!options.siteName?.trim()) {
    throw new Error('experiencePageSeo requires options.siteName from CMS')
  }
  if (!options.title?.trim()) {
    throw new Error('experiencePageSeo requires options.title from CMS')
  }
  if (!options.description?.trim()) {
    throw new Error('experiencePageSeo requires options.description from CMS')
  }
  const path = '/experience'
  const url = absoluteUrl(siteUrl, path)
  const homeUrl = absoluteUrl(siteUrl, '/')
  const personEntityId = personId(siteUrl)
  const siteName = options.siteName
  const title = options.title
  const description = options.description
  return {
    title,
    description,
    path,
    robots: 'index, follow',
    ogType: 'profile',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfilePage',
          'name': title,
          description,
          url,
          'isPartOf': {
            '@type': 'WebSite',
            '@id': websiteId(siteUrl),
            'name': siteName,
            'url': homeUrl,
          },
          'mainEntity': {
            '@id': personEntityId,
          },
        },
        {
          '@type': 'Person',
          '@id': personEntityId,
          'name': person.name,
          'jobTitle': person.role,
          'url': homeUrl,
          'sameAs': person.sameAs,
        },
      ],
    },
  }
}

export function seoHead(siteUrl: string, page: PageSeo, siteName = SITE_NAME) {
  const url = absoluteUrl(siteUrl, page.path)
  const imageUrl = page.image ? absoluteUrl(siteUrl, page.image.src) : undefined
  const meta: Array<Record<string, string>> = [
    { name: 'description', content: page.description },
    { name: 'robots', content: page.robots },
    { property: 'og:site_name', content: siteName },
    { property: 'og:title', content: page.title },
    { property: 'og:description', content: page.description },
    { property: 'og:url', content: url },
    { property: 'og:type', content: page.ogType },
    { name: 'twitter:card', content: imageUrl ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: page.title },
    { name: 'twitter:description', content: page.description },
  ]
  if (imageUrl && page.image) {
    meta.push(
      { property: 'og:image', content: imageUrl },
      { property: 'og:image:alt', content: page.image.alt },
      { name: 'twitter:image', content: imageUrl },
      { name: 'twitter:image:alt', content: page.image.alt },
    )
  }
  return {
    title: page.title,
    link: [{ rel: 'canonical', href: url }],
    meta,
    script: [
      {
        type: 'application/ld+json',
        // Escape < so a future description cannot break out of the script tag.
        innerHTML: JSON.stringify(page.jsonLd).replace(/</g, '\\u003c'),
      },
    ],
  }
}

export function sitemapPaths(productSlugs: string[] = []): string[] {
  const paths = [
    '/',
    '/experience',
    '/products',
    ...productSlugs.map(slug => `/products/${slug}`),
  ]
  return [...new Set(paths)]
}

export function buildSitemapXml(
  siteUrl: string,
  paths?: string[],
  productSlugs: string[] = [],
): string {
  const resolvedPaths = paths ?? sitemapPaths(productSlugs)
  const origin = resolveSiteUrl(siteUrl)
  const urls = resolvedPaths.map((path) => {
    const loc = absoluteUrl(origin, path)
    return `  <url>\n    <loc>${loc}</loc>\n  </url>`
  }).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export function buildRobotsTxt(siteUrl: string): string {
  const origin = resolveSiteUrl(siteUrl)
  return [
    'User-agent: *',
    'Allow: /',
    'Allow: /products',
    'Allow: /products/',
    'Disallow: /finance',
    'Disallow: /survey',
    'Disallow: /service',
    'Disallow: /login',
    '',
    `Sitemap: ${absoluteUrl(origin, '/sitemap.xml')}`,
    '',
  ].join('\n')
}
