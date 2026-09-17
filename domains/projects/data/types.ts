export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
  /** Optional smaller source for grid/hero; full `src` stays for lightbox. */
  srcThumb?: string
  srcset?: string
  sizes?: string
}

export interface ProjectLink {
  label: string
  href: string
}

export interface ProjectLaunchCta {
  label: string
  href: string
  kind: 'primary' | 'secondary'
  /** Resolve href from the latest GitHub macOS universal asset when a release is available */
  macosDownload?: boolean
}

export interface ProjectTrustFact {
  label: string
  value: string
  href?: string
}

export interface ProjectLaunch {
  lead: string
  supportingLine: string
  ctas: ProjectLaunchCta[]
  /** Evergreen trust copy; version and release date are filled from GitHub when linked */
  trustFacts: ProjectTrustFact[]
  trademark?: string
}

export interface ProjectBenefit {
  title: string
  description: string
}

export interface ProjectGuideStep {
  title: string
  body: string
}

export interface ProjectGuide {
  title: string
  warning?: string
  steps: ProjectGuideStep[]
}

export interface GithubRepoRef {
  owner: string
  repo: string
}

export interface ProjectSeo {
  title: string
  description: string
  /** Overrides the default site suffix in the document title, e.g. Daniel Kazansky */
  titleSuffix?: string
}

export interface ProjectSoftwareApplication {
  applicationCategory: string
  operatingSystem: string
  license: string
}

export interface Project {
  slug: string
  name: string
  shortDescription: string
  description?: string
  logo?: ProjectImage
  socialImage?: ProjectImage
  benefits?: ProjectBenefit[]
  guide?: ProjectGuide
  links?: ProjectLink[]
  launch?: ProjectLaunch
  gallery?: ProjectImage[]
  github?: GithubRepoRef
  seo?: ProjectSeo
  softwareApplication?: ProjectSoftwareApplication
  stackTags?: string[]
}

export function projectPath(slug: string): string {
  return `/projects/${slug}`
}
