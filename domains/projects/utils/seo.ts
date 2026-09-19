import { projectPath, type Project } from '../data/types'
import { getProjectRoutes } from '../project-routes'

export const DEFAULT_SITE_URL = 'https://kazansky.dev'
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

function socialImage(project: Project) {
  return project.socialImage || project.logo
}

export function personId(siteUrl: string): string {
  return `${absoluteUrl(siteUrl, '/')}#person`
}

export function websiteId(siteUrl: string): string {
  return `${absoluteUrl(siteUrl, '/')}#website`
}

export function projectsIndexSeo(siteUrl: string, projects: Project[]): PageSeo {
  const path = '/projects'
  const url = absoluteUrl(siteUrl, path)
  const image = socialImage(projects[0])
  return {
    title: `Products | ${SITE_NAME}`,
    description:
      'Public products from Daniel Kazansky, including Simple Rekordbox Converter for Rekordbox 6 and 7.',
    path,
    robots: 'index, follow',
    ogType: 'website',
    image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Products',
      'description':
        'Public products from Daniel Kazansky.',
      url,
      'isPartOf': {
        '@type': 'WebSite',
        'name': SITE_NAME,
        'url': absoluteUrl(siteUrl, '/'),
      },
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': projects.map((project, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': project.name,
          'url': absoluteUrl(siteUrl, projectPath(project.slug)),
        })),
      },
    },
  }
}

export function projectDetailSeo(siteUrl: string, project: Project): PageSeo {
  const path = projectPath(project.slug)
  const url = absoluteUrl(siteUrl, path)
  const description = project.seo?.description ?? project.shortDescription
  const titleSuffix = project.seo?.titleSuffix ?? SITE_NAME
  const title = `${project.seo?.title ?? project.name} | ${titleSuffix}`
  const image = socialImage(project)
  const software = project.softwareApplication
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Daniel Kazansky',
          'item': absoluteUrl(siteUrl, '/'),
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Products',
          'item': absoluteUrl(siteUrl, '/projects'),
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': project.name,
          'item': url,
        },
      ],
    },
  ]

  if (software) {
    graph.unshift({
      '@type': 'SoftwareApplication',
      'name': project.name,
      description,
      url,
      'image': image ? absoluteUrl(siteUrl, image.src) : undefined,
      'applicationCategory': software.applicationCategory,
      'operatingSystem': software.operatingSystem,
      'license': software.license,
      'isAccessibleForFree': true,
    })
  }

  return {
    title,
    description,
    path,
    robots: 'index, follow',
    ogType: 'website',
    image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': graph,
    },
  }
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
  const title = `${home.person.name} | ${home.person.role}`
  const description = home.valueProposition
  const creativeWorks = homepageCreativeWorks(siteUrl, home)
  const person = personId(siteUrl)
  const website = websiteId(siteUrl)
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'WebSite',
      '@id': website,
      'name': SITE_NAME,
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

export function experiencePageSeo(
  siteUrl: string,
  person: ExperiencePagePerson,
): PageSeo {
  const path = '/experience'
  const url = absoluteUrl(siteUrl, path)
  const homeUrl = absoluteUrl(siteUrl, '/')
  const personEntityId = personId(siteUrl)
  const title = `Professional Experience | ${person.name}`
  const description
    = `Professional timeline for ${person.name}, ${person.role}: digital products, websites, and software delivery from 2018 through AI-native full-stack systems.`
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
            'name': SITE_NAME,
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

export function seoHead(siteUrl: string, page: PageSeo) {
  const url = absoluteUrl(siteUrl, page.path)
  const imageUrl = page.image ? absoluteUrl(siteUrl, page.image.src) : undefined
  const meta: Array<Record<string, string>> = [
    { name: 'description', content: page.description },
    { name: 'robots', content: page.robots },
    { property: 'og:site_name', content: SITE_NAME },
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

export function sitemapPaths(): string[] {
  const paths = ['/', '/experience', ...getProjectRoutes()]
  return [...new Set(paths)]
}

export function buildSitemapXml(siteUrl: string, paths = sitemapPaths()): string {
  const origin = resolveSiteUrl(siteUrl)
  const urls = paths.map((path) => {
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
    'Allow: /projects',
    'Allow: /projects/',
    'Disallow: /finance',
    'Disallow: /survey',
    'Disallow: /service',
    'Disallow: /login',
    '',
    `Sitemap: ${absoluteUrl(origin, '/sitemap.xml')}`,
    '',
  ].join('\n')
}
