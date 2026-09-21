import { projectPath, type Project } from '../data/types'
import {
  absoluteUrl,
  type PageSeo,
} from '~/utils/seo'

function socialImage(project: Project) {
  return project.socialImage || project.logo
}

export interface ProjectsIndexSeoOptions {
  siteName: string
  title?: string
  description: string
  collectionName?: string
}

export function projectsIndexSeo(
  siteUrl: string,
  projects: Project[],
  options: ProjectsIndexSeoOptions,
): PageSeo {
  const siteName = options.siteName
  if (!siteName?.trim()) {
    throw new Error('projectsIndexSeo requires options.siteName from CMS')
  }
  if (!options.description?.trim()) {
    throw new Error('projectsIndexSeo requires options.description from CMS')
  }
  const collectionName = options.collectionName || options.title || 'Products'
  const path = '/products'
  const url = absoluteUrl(siteUrl, path)
  const image = socialImage(projects[0])
  const description = options.description
  return {
    title: `${collectionName} | ${siteName}`,
    description,
    path,
    robots: 'index, follow',
    ogType: 'website',
    image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': collectionName,
      'description': description,
      url,
      'isPartOf': {
        '@type': 'WebSite',
        'name': siteName,
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

export interface ProjectDetailSeoOptions {
  siteName: string
  personName: string
  productsLabel?: string
}

export function projectDetailSeo(
  siteUrl: string,
  project: Project,
  options: ProjectDetailSeoOptions,
): PageSeo {
  if (!options.siteName?.trim()) {
    throw new Error('projectDetailSeo requires options.siteName from CMS')
  }
  if (!options.personName?.trim()) {
    throw new Error('projectDetailSeo requires options.personName from CMS')
  }
  const siteName = options.siteName
  const personName = options.personName
  const productsLabel = options.productsLabel || 'Products'
  const path = projectPath(project.slug)
  const url = absoluteUrl(siteUrl, path)
  const description = project.seo?.description ?? project.shortDescription
  const titleSuffix = project.seo?.titleSuffix ?? siteName
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
          'name': personName,
          'item': absoluteUrl(siteUrl, '/'),
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': productsLabel,
          'item': absoluteUrl(siteUrl, '/products'),
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
