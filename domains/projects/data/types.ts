export interface ProjectImage {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
}

export interface ProjectLink {
  label: string
  href: string
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
  gallery?: ProjectImage[]
  github?: GithubRepoRef
  seo?: ProjectSeo
  softwareApplication?: ProjectSoftwareApplication
}

export function projectPath(slug: string): string {
  return `/projects/${slug}`
}
