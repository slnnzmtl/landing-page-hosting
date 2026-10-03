import { describe, expect, it } from 'vitest'
import { projectsIndexSeo } from '~/domains/projects/utils/projects-seo'
import type { ProjectSummary } from '~/domains/projects/data/types'

const projects: ProjectSummary[] = [
  {
    slug: 'appointment',
    name: 'AI Appointment',
    shortDescription: 'Booking automation.',
    stackTags: ['TypeScript'],
    href: '/projects/appointment',
    hrefLabel: 'View case',
    hasCaseStudy: true,
  },
  {
    slug: 'builder',
    name: 'Website Builder',
    shortDescription: 'Reusable CMS platform.',
    stackTags: ['Nuxt'],
    href: 'https://github.com/example/builder',
    hrefLabel: 'View repository',
    hasCaseStudy: false,
  },
]

describe('Projects index SEO', () => {
  it('uses the Projects route and canonical project destinations', () => {
    const page = projectsIndexSeo('https://example.test', projects, {
      siteName: 'Example.dev',
      title: 'Projects',
      description: 'Selected projects.',
    })

    expect(page.path).toBe('/projects')
    expect(page.title).toBe('Projects | Example.dev')
    expect(page.jsonLd.mainEntity).toMatchObject({
      '@type': 'ItemList',
      'itemListElement': [
        { url: 'https://example.test/projects/appointment' },
        { url: 'https://github.com/example/builder' },
      ],
    })
  })
})
