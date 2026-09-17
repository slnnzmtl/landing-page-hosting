import { projectPath, type Project } from '../data/types'
import { getProjectRoutes } from '../project-routes'

export const DEFAULT_SITE_URL = 'https://landing-hosting.vercel.app'
export const SITE_NAME = 'Kazansky Development'

export interface PageSeo {
  title: string
  description: string
  path: string
  robots: string
  ogType: 'website' | 'article'
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

export function projectsIndexSeo(siteUrl: string, projects: Project[]): PageSeo {
  const path = '/projects'
  const url = absoluteUrl(siteUrl, path)
  const image = socialImage(projects[0])
  return {
    title: `Selected projects | ${SITE_NAME}`,
    description:
      'Selected public projects and products from Kazansky Development, including Simple Rekordbox Converter for Rekordbox 6 and 7.',
    path,
    robots: 'index, follow',
    ogType: 'website',
    image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Selected projects',
      'description':
        'Public projects and products from Kazansky Development.',
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
  const title = `${project.seo?.title ?? project.name} | ${SITE_NAME}`
  const image = socialImage(project)
  const software = project.softwareApplication
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Studio homepage',
          'item': absoluteUrl(siteUrl, '/'),
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Selected projects',
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
