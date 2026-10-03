import type { ProjectSummary } from '../data/types'
import { absoluteUrl, type PageSeo } from '~/utils/seo'

export interface ProjectsIndexSeoOptions {
  siteName: string
  title?: string
  description: string
}

export function projectsIndexSeo(
  siteUrl: string,
  projects: ProjectSummary[],
  options: ProjectsIndexSeoOptions,
): PageSeo {
  if (!options.siteName?.trim()) throw new Error('projectsIndexSeo requires options.siteName from CMS')
  if (!options.description?.trim()) throw new Error('projectsIndexSeo requires options.description from CMS')
  const title = options.title || 'Projects'
  const path = '/projects'
  const description = options.description

  return {
    title: `${title} | ${options.siteName}`,
    description,
    path,
    robots: 'index, follow',
    ogType: 'website',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': title,
      description,
      'url': absoluteUrl(siteUrl, path),
      'isPartOf': {
        '@type': 'WebSite',
        'name': options.siteName,
        'url': absoluteUrl(siteUrl, '/'),
      },
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': projects.map((project, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': project.name,
          'url': absoluteUrl(siteUrl, project.href),
        })),
      },
    },
  }
}
