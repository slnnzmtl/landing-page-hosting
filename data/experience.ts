import type { ExperiencePreviewItem } from './homepage'

export type EngagementType
  = 'full-time'
    | 'part-time'
    | 'freelance'
    | 'contractor'
    | 'independent'

export type WorkMode = 'remote' | 'on-site' | 'hybrid'

export type OutcomeQualifier = 'personal' | 'team' | 'platform'

export interface ExperienceOutcome {
  text: string
  qualifier: OutcomeQualifier
}

export interface ExperienceLink {
  label: string
  href: string
}

/** Public experience role for pages. Private claim evidence stays in Directus only. */
export interface ExperienceRole {
  id: string
  organization: string
  title: string
  engagementType: EngagementType
  location: string
  workMode: WorkMode
  /** ISO month start, e.g. 2024-01 */
  start: string
  /** ISO month end, or null when present */
  end: string | null
  scope: string
  contributions: string[]
  outcomes: ExperienceOutcome[]
  technologies: string[]
  links?: ExperienceLink[]
  icon?: string
  iconAlt?: string
  /** Condensed homepage summary; only set for homepage professional cards. */
  homepageSummary?: string
}

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
] as const

export function formatExperienceMonth(isoMonth: string): string {
  const [year, month] = isoMonth.split('-').map(Number)
  if (!year || !month || month < 1 || month > 12) return isoMonth
  return `${MONTH_LABELS[month - 1]} ${year}`
}

export function formatExperienceRange(role: Pick<ExperienceRole, 'start' | 'end'>): string {
  const start = formatExperienceMonth(role.start)
  if (!role.end) return `${start} – Present`
  return `${start} – ${formatExperienceMonth(role.end)}`
}

export function engagementTypeLabel(type: EngagementType): string {
  switch (type) {
    case 'full-time':
      return 'Full-time'
    case 'part-time':
      return 'Part-time'
    case 'freelance':
      return 'Freelance'
    case 'contractor':
      return 'Long-term contractor'
    case 'independent':
      return 'Independent'
  }
}

export function workModeLabel(mode: WorkMode): string {
  switch (mode) {
    case 'remote':
      return 'Remote'
    case 'on-site':
      return 'On-site'
    case 'hybrid':
      return 'Hybrid'
  }
}

export function outcomeQualifierLabel(qualifier: OutcomeQualifier): string {
  switch (qualifier) {
    case 'personal':
      return 'Personal contribution'
    case 'team':
      return 'Team outcome'
    case 'platform':
      return 'Platform scale'
  }
}

/** Meta line for cards: organization · engagement · dates · location */
export function experienceSubtitle(role: ExperienceRole): string {
  const parts = [
    role.organization,
    engagementTypeLabel(role.engagementType),
    formatExperienceRange(role),
    role.location,
  ]
  return parts.join(' · ')
}

/** In-app link to a role card on `/experience`. */
export function experienceRolePath(roleId: string): string {
  return `/experience#${roleId}`
}

/** Compact recent-role chips for the homepage from ordered ids + roles. */
export function homepageExperiencePreview(
  previewIds: string[],
  roles: ExperienceRole[],
): ExperiencePreviewItem[] {
  const byId = new Map(roles.map(role => [role.id, role]))
  return previewIds.map((id) => {
    const role = byId.get(id)
    if (!role) {
      throw new Error(`Missing experience role for homepage preview: ${id}`)
    }
    return {
      id: role.id,
      organization: role.organization,
      icon: role.icon,
      iconAlt: role.iconAlt,
    }
  })
}

/** Flatten user-facing role fields for claim-rejection tests. */
export function experienceUserFacingCopy(roles: ExperienceRole[]): string {
  return roles
    .flatMap(role => [
      role.id,
      role.organization,
      role.title,
      role.engagementType,
      role.location,
      role.workMode,
      role.start,
      role.end ?? 'present',
      role.scope,
      ...role.contributions,
      ...role.outcomes.map(o => `${o.qualifier} ${o.text}`),
      ...role.technologies,
      ...(role.links ?? []).flatMap(l => [l.label, l.href]),
      role.homepageSummary ?? '',
    ])
    .join(' ')
}
