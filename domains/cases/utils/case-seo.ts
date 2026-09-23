import { casePath, type CaseStudy } from '../data/types'
import {
  absoluteUrl,
  personId,
  websiteId,
  type PageSeo,
} from '~/utils/seo'

function socialImage(caseStudy: CaseStudy) {
  return caseStudy.socialImage || caseStudy.heroMedia
}

function githubSourceUrl(caseStudy: CaseStudy): string | undefined {
  return caseStudy.evidenceLinks.find(link =>
    /^https?:\/\/(?:www\.)?github\.com\//i.test(link.href),
  )?.href
}

export interface CaseDetailSeoOptions {
  siteName: string
  personName: string
  featuredWorkHeading: string
}

export function caseDetailSeo(
  siteUrl: string,
  caseStudy: CaseStudy,
  options: CaseDetailSeoOptions,
): PageSeo {
  if (!options.siteName?.trim()) {
    throw new Error('caseDetailSeo requires options.siteName from CMS')
  }
  if (!options.personName?.trim()) {
    throw new Error('caseDetailSeo requires options.personName from CMS')
  }
  if (!options.featuredWorkHeading?.trim()) {
    throw new Error('caseDetailSeo requires options.featuredWorkHeading from CMS')
  }

  const siteName = options.siteName
  const personName = options.personName
  const path = casePath(caseStudy.slug)
  const url = absoluteUrl(siteUrl, path)
  const description = caseStudy.seo.description
  const title = `${caseStudy.seo.title} | ${siteName}`
  const image = socialImage(caseStudy)
  const githubUrl = githubSourceUrl(caseStudy)
  const person = personId(siteUrl)
  const website = websiteId(siteUrl)

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
          'name': options.featuredWorkHeading,
          'item': absoluteUrl(siteUrl, '/#featured-work'),
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': caseStudy.name,
          'item': url,
        },
      ],
    },
    {
      '@type': ['CreativeWork', 'Article'],
      'name': caseStudy.name,
      description,
      url,
      'author': { '@id': person },
      'isPartOf': { '@id': website },
      ...(image
        ? { image: absoluteUrl(siteUrl, image.src) }
        : {}),
      ...(caseStudy.stackTags.length
        ? { keywords: caseStudy.stackTags.join(', ') }
        : {}),
    },
  ]

  if (githubUrl) {
    graph.push({
      '@type': 'SoftwareSourceCode',
      'name': caseStudy.name,
      'codeRepository': githubUrl,
      'url': githubUrl,
      'author': { '@id': person },
      ...(caseStudy.stackTags.length
        ? { programmingLanguage: caseStudy.stackTags }
        : {}),
    })
  }

  return {
    title,
    description,
    path,
    robots: 'index, follow',
    ogType: 'article',
    image: image
      ? {
          src: image.src,
          alt: image.alt,
          width: image.width,
          height: image.height,
        }
      : undefined,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': graph,
    },
  }
}
