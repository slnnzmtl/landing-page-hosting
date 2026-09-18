import type { WorkCard } from './homepage'

export type ClaimStatus = 'approved' | 'pending-validation' | 'internal-only'

export type EngagementType
  = 'full-time'
    | 'part-time'
    | 'freelance'
    | 'contractor'
    | 'independent'

export type WorkMode = 'remote' | 'on-site' | 'hybrid'

export type OutcomeQualifier = 'personal' | 'team' | 'platform'

export interface ClaimSource {
  /** Linear ticket, public repo, or approval note. Never shown on the page. */
  origin: string
  status: ClaimStatus
  note: string
}

export interface ExperienceOutcome {
  text: string
  qualifier: OutcomeQualifier
}

export interface ExperienceLink {
  label: string
  href: string
}

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
  source: ClaimSource
}

const linkedInProfile: ClaimSource = {
  origin: 'https://www.linkedin.com/in/daniel-kazansky/',
  status: 'approved',
  note: 'Public LinkedIn profile attached to DDD-157 / DDD-170. Source for titles, dates, engagement types, locations, and metrics visible on LinkedIn.',
}

const ticket167: ClaimSource = {
  origin: 'https://linear.app/ddd7486/issue/DDD-167/add-enterprise-work-track-and-sanitized-experience-case-studies',
  status: 'approved',
  note:
    'Sanitized enterprise marketplace, analytics, and subscription commerce framing from DDD-167; approved public metrics: 20% faster merchant setup, 25% higher AI-assisted onboarding completion for 500+ users, 15% lower payment abandonment.',
}

const cvAndPublicRepos: ClaimSource = {
  origin: 'https://github.com/slnnzmtl/langgraph-appointment-bot',
  status: 'approved',
  note: 'Independent AI role from owner CV plus public LangGraph Appointment Bot repository evidence. Do not imply automation at scale.',
}

/** Shared tenure copy used across homepage and experience SEO. */
export const professionalTenure = {
  short: '7+ years',
  label: 'Years across digital products and software delivery',
  heroSubtitle: '7+ years across digital products and software delivery',
  softwareEngineeringSince: 'Building software since 2019',
} as const

/**
 * Canonical professional history for /experience.
 * Ordered independent-first, then reverse chronological commercial roles.
 */
export const experienceRoles: ExperienceRole[] = [
  {
    id: 'independent-ai-fullstack',
    organization: 'Independent',
    title: 'Full Stack AI Developer',
    engagementType: 'independent',
    location: 'Remote',
    workMode: 'remote',
    start: '2024-01',
    end: null,
    scope:
      'Independent full-stack work on AI-native systems: Telegram assistants, CRM-connected booking flows, and controlled tool use with explicit approval and persistence.',
    contributions: [
      'Built a multilingual LangGraph appointment bot for booking, rescheduling, and cancellation through Telegram with live CRM availability.',
      'Implemented identity checks, approval-controlled writes, and persistence so consequential actions require explicit confirmation.',
      'Packaged delivery with Docker and automated tests around tool-using agent workflows.',
    ],
    outcomes: [
      {
        text: 'Public LangGraph Appointment Bot demonstrates controlled tool use, live availability, and approval gates—without implying automation at scale.',
        qualifier: 'personal',
      },
    ],
    technologies: ['LangGraph', 'Telegram', 'EspoCRM', 'Docker', 'Python', 'TypeScript'],
    links: [
      {
        label: 'LangGraph Appointment Bot on GitHub',
        href: 'https://github.com/slnnzmtl/langgraph-appointment-bot',
      },
      {
        label: 'LangGraph Personal Assistant on GitHub',
        href: 'https://github.com/slnnzmtl/langgraph-personal-assistant',
      },
      {
        label: 'Directus Website Builder on GitHub',
        href: 'https://github.com/slnnzmtl/directus-website-builder',
      },
    ],
    source: cvAndPublicRepos,
  },
  {
    id: 'upwork-reputation-team',
    organization: 'Upwork',
    title: 'Senior Software Engineer (Reputation Team)',
    engagementType: 'contractor',
    location: 'Remote',
    workMode: 'remote',
    start: '2025-01',
    end: '2026-05',
    scope:
      'Embedded long-term contractor on the Reputation team, owning marketplace reputation and enforcement UI domains end-to-end with PagerDuty production responsibility.',
    contributions: [
      'Owned frontend delivery for Partner Certified Talent and Freelancer Aggregated Strengths across Profiles, Search, and Onboarding.',
      'Contributed to the Job Success Dashboard migration to a new evaluation model.',
      'Led Vue 2 to Vue 3 modernization of legacy reputation UI modules.',
      'Designed an AI-assisted development workflow with Cursor, Claude Code, and MCP integrations for Figma, Linear, GitHub, and Confluence.',
    ],
    outcomes: [
      {
        text: 'Primary frontend ownership on Partner Certified Talent work reaching a marketplace with millions of freelancers (platform scale, not personal headcount).',
        qualifier: 'platform',
      },
      {
        text: 'Held PagerDuty on-call responsibility for production reputation surfaces.',
        qualifier: 'personal',
      },
    ],
    technologies: ['Vue 3', 'Nuxt', 'TypeScript', 'Cursor', 'MCP'],
    icon: '/images/experience/upwork.png',
    iconAlt: 'Upwork',
    homepageSummary:
      'Built and modernized reputation, credentialing, and enforcement experiences across a marketplace serving tens of millions of users. Owned frontend domains end-to-end and supported production systems through on-call responsibilities.',
    source: linkedInProfile,
  },
  {
    id: 'subbly-senior-software-developer',
    organization: 'Subbly®',
    title: 'Senior Software Developer',
    engagementType: 'full-time',
    location: 'Remote',
    workMode: 'remote',
    start: '2023-11',
    end: '2024-12',
    scope:
      'Subscription commerce product engineering spanning merchant setup UX, AI-assisted onboarding, checkout, and a flexible design system.',
    contributions: [
      'Refactored subscription setup UX to shorten merchant time-to-configure.',
      'Developed an AI-powered onboarding chatbot for merchant activation flows.',
      'Optimized cart and payment flows to reduce abandonment.',
      'Built a custom design system for reusable storefront and admin UI.',
    ],
    outcomes: [
      {
        text: '20% faster merchant setup and 25% higher AI-assisted onboarding completion for 500+ merchants/users.',
        qualifier: 'team',
      },
      {
        text: '15% lower cart and payment abandonment.',
        qualifier: 'team',
      },
    ],
    technologies: ['TypeScript', 'Vue'],
    icon: '/images/experience/subbly.png',
    iconAlt: 'Subbly',
    homepageSummary:
      'Subscription commerce product engineering spanning setup UX, AI-assisted onboarding, and checkout. Reduced merchant setup time by 20%, raised AI-assisted onboarding completion by 25% for 500+ users, and cut payment abandonment by 15%.',
    source: ticket167,
  },
  {
    id: 'woki-lead-software-developer',
    organization: 'Woki.one',
    title: 'Lead Software Developer in a startup',
    engagementType: 'part-time',
    location: 'Remote',
    workMode: 'remote',
    start: '2023-06',
    end: '2023-12',
    scope:
      'Led a four-person engineering team building a modular Vue 3 CRM with configurable UI under startup delivery pressure.',
    contributions: [
      'Led a 4-person team delivering a modular Vue 3 CRM architecture.',
      'Engineered configurable UI features for customer-specific customization.',
      'Drove frontend performance work to reach a 95+ Google PageSpeed score.',
    ],
    outcomes: [
      {
        text: 'Delivered a modular Vue 3 CRM with configurable UI for the product.',
        qualifier: 'team',
      },
      {
        text: 'Reached a 95+ Google PageSpeed score on primary CRM surfaces.',
        qualifier: 'personal',
      },
    ],
    technologies: ['Vue 3', 'TypeScript'],
    icon: '/images/experience/woki.png',
    iconAlt: 'Woki.one',
    source: linkedInProfile,
  },
  {
    id: 'capgemini-software-developer',
    organization: 'Capgemini Engineering',
    title: 'Software Developer',
    engagementType: 'full-time',
    location: 'Remote',
    workMode: 'remote',
    start: '2022-06',
    end: '2023-05',
    scope:
      'Built React/TypeScript/Redux analytics interfaces for enterprise marketing and forecasting in a Lerna monorepo.',
    contributions: [
      'Developed interactive dashboards handling large analytics payloads over HTTP.',
      'Worked in a Lerna monorepo with shared React/TypeScript packages.',
      'Supported marketing and forecasting workflows for enterprise clients.',
    ],
    outcomes: [
      {
        text: 'Analytics interfaces handling 10M+ data points over HTTP (platform/system scale).',
        qualifier: 'platform',
      },
    ],
    technologies: ['React', 'TypeScript', 'Redux', 'Lerna'],
    icon: '/images/experience/capgemini.png',
    iconAlt: 'Capgemini Engineering',
    homepageSummary:
      'Built interactive dashboards for a big data analytics system serving enterprise marketing and forecasting, managing 10M+ data points over HTTP in a React monorepo.',
    source: linkedInProfile,
  },
  {
    id: 'kazansky-dev-fullstack',
    organization: 'Kazansky.dev',
    title: 'Full Stack Developer',
    engagementType: 'freelance',
    location: 'Remote',
    workMode: 'remote',
    start: '2022-02',
    end: '2022-11',
    scope:
      'Freelance full-stack delivery with Vue and Vuex. Scope kept conservative: LinkedIn lists skills without a detailed public role description.',
    contributions: [
      'Delivered freelance full-stack features using Vue and Vuex.',
      'Supported client web delivery as an independent contractor under Kazansky.dev.',
    ],
    outcomes: [
      {
        text: 'Completed a multi-month freelance engagement delivering Vue/Vuex client work.',
        qualifier: 'personal',
      },
    ],
    technologies: ['Vue', 'Vuex'],
    source: linkedInProfile,
  },
  {
    id: 'malevich-frontend-developer',
    organization: 'Malevich',
    title: 'Frontend Developer',
    engagementType: 'full-time',
    location: 'Remote',
    workMode: 'remote',
    start: '2020-11',
    end: '2022-06',
    scope:
      'Frontend and mobile delivery for operational tooling, equipment scanning, and multilingual e-commerce on React, Next.js, GraphQL, and React Native/Expo.',
    contributions: [
      'Built React/GraphQL/Next.js operational tooling used by hundreds of daily operators.',
      'Delivered a React Native/Expo panel for equipment scanning workflows.',
      'Shipped a multilingual React/Redux e-commerce platform with Node.js backend collaboration.',
    ],
    outcomes: [
      {
        text: 'Operational tooling serving 500+ daily users (platform scale).',
        qualifier: 'platform',
      },
    ],
    technologies: ['React', 'Next.js', 'GraphQL', 'React Native', 'Expo', 'Redux', 'Node.js'],
    source: linkedInProfile,
  },
  {
    id: 'woman-insight-web-developer',
    organization: 'Woman Insight Franchise',
    title: 'Web Developer',
    engagementType: 'full-time',
    location: 'Odesa / Remote',
    workMode: 'hybrid',
    start: '2019-03',
    end: '2020-10',
    scope:
      'Maintained a Vue.js and PHP Laravel franchise site with marketing automation, ad/email/CRM integrations, and custom quizzes over a large contact database.',
    contributions: [
      'Maintained Vue.js and PHP Laravel site features for franchise marketing.',
      'Operated databases supporting 300K+ contacts with marketing automation workflows.',
      'Integrated ads, email, and CRM systems; built custom quizzes for lead capture.',
    ],
    outcomes: [
      {
        text: 'Supported marketing systems over a database of 300K+ contacts (platform scale).',
        qualifier: 'platform',
      },
    ],
    technologies: ['Vue.js', 'PHP', 'Laravel', 'JavaScript'],
    source: linkedInProfile,
  },
  {
    id: 'dals-media-project-manager',
    organization: 'DALS Media',
    title: 'Project Manager',
    engagementType: 'full-time',
    location: 'Odesa, Ukraine',
    workMode: 'on-site',
    start: '2018-04',
    end: '2019-02',
    scope:
      'Managed and grew a network of media websites, using SEO to generate partner-campaign traffic alongside WordPress and frontend design work.',
    contributions: [
      'Managed a network of media websites and coordinated partner advertising campaigns.',
      'Used SEO to generate traffic for partner campaigns.',
      'Contributed WordPress and frontend design work across the media network.',
    ],
    outcomes: [
      {
        text: 'Grew partner-campaign traffic through SEO across the media-site network.',
        qualifier: 'team',
      },
    ],
    technologies: ['WordPress', 'SEO', 'HTML', 'CSS'],
    source: linkedInProfile,
  },
]

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

export function publishedExperienceRoles(
  roles: ExperienceRole[] = experienceRoles,
): ExperienceRole[] {
  return roles.filter(role => role.source.status === 'approved')
}

const HOMEPAGE_PROFESSIONAL_IDS = [
  'upwork-reputation-team',
  'subbly-senior-software-developer',
  'capgemini-software-developer',
] as const

/** Condensed WorkCards for the homepage professional section, derived from canonical roles. */
export function homepageProfessionalCards(
  roles: ExperienceRole[] = experienceRoles,
): WorkCard[] {
  const byId = new Map(publishedExperienceRoles(roles).map(role => [role.id, role]))
  return HOMEPAGE_PROFESSIONAL_IDS.map((id) => {
    const role = byId.get(id)
    if (!role) {
      throw new Error(`Missing approved experience role for homepage card: ${id}`)
    }
    return {
      slug: role.id,
      title: role.title,
      subtitle: experienceSubtitle(role),
      icon: role.icon,
      iconAlt: role.iconAlt,
      summary: role.homepageSummary ?? role.scope,
    }
  })
}

/** Flatten user-facing role fields for claim-rejection tests (excludes source). */
export function experienceUserFacingCopy(roles: ExperienceRole[] = publishedExperienceRoles()): string {
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
      professionalTenure.short,
      professionalTenure.label,
      professionalTenure.heroSubtitle,
      professionalTenure.softwareEngineeringSince,
    ])
    .join(' ')
}
