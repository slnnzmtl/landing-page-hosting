export type ProjectTrack = 'enterprise' | 'independent' | 'open_source'

export interface ProjectSummary {
  slug: string
  name: string
  shortDescription: string
  role?: string
  track?: ProjectTrack | string
  stackTags: string[]
  href: string
  hrefLabel: string
  hasCaseStudy: boolean
}

export function projectSummaryCategory(project: Pick<ProjectSummary, 'track' | 'hasCaseStudy'>): string {
  if (project.hasCaseStudy) return 'Case study'
  if (project.track === 'open_source') return 'Open-source platform'
  if (project.track === 'enterprise') return 'Enterprise project'
  return 'Independent project'
}

export function isExternalProjectHref(href: string): boolean {
  return /^https?:\/\//i.test(href)
}
