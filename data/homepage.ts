import { experienceRolePath, homepageExperiencePreview, professionalTenure } from './experience'

export interface HomepageLink {
  label: string
  href: string
}

export interface ProofItem {
  value: string
  label: string
}

export interface HeroFocusItem {
  title: string
  summary: string
}

export interface HeroFocus {
  heading: string
  items: HeroFocusItem[]
}

export interface FeaturedCase {
  slug: string
  title: string
  featured?: boolean
  problem: string
  role: string
  contribution: string
  outcome: string
  stack: string[]
  href: string
  hrefLabel: string
}

export interface ExperiencePreviewItem {
  id: string
  organization: string
  icon?: string
  iconAlt?: string
}

export interface ExperiencePreview {
  heading: string
  items: ExperiencePreviewItem[]
  cta: HomepageLink
}

export interface ProductSpotlightImage {
  src: string
  srcThumb?: string
  srcset?: string
  sizes?: string
  alt: string
  width: number
  height: number
}

export interface ProductSpotlight {
  slug: string
  title: string
  lead: string
  supportingLine: string
  image: ProductSpotlightImage
  cta: HomepageLink
  tags: string[]
}

export interface ProductsSection {
  heading: string
  description: string
  items: ProductSpotlight[]
}

export interface HomepageContent {
  person: {
    name: string
    role: string
  }
  valueProposition: string
  primaryCtas: HomepageLink[]
  profileLinks: HomepageLink[]
  heroFocus: HeroFocus
  proof: ProofItem[]
  featuredWorkIntro: string
  featuredCases: FeaturedCase[]
  experiencePreview: ExperiencePreview
  products: ProductsSection
  contact: {
    heading: string
    summary: string
    email: HomepageLink
    telegram: HomepageLink
  }
}

export const homepageContent: HomepageContent = {
  person: {
    name: 'Daniel Kazansky',
    role: 'AI-Native Full-Stack Engineer',
  },
  valueProposition:
    `I build reliable AI-enabled products connecting models to APIs, CRMs, databases, and real operations—backed by ${professionalTenure.heroSubtitle}.`,
  primaryCtas: [
    {
      label: 'View flagship case',
      href: '#flagship-case',
    },
    {
      label: 'Discuss a project',
      href: '#contact',
    },
  ],
  profileLinks: [
    {
      label: 'GitHub',
      href: 'https://github.com/slnnzmtl',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/daniel-kazansky/',
    },
  ],
  heroFocus: {
    heading: 'Current focus',
    items: [
      {
        title: 'Agent workflows',
        summary: 'Tool-using agents with persistence, authorization, and human approval for consequential actions.',
      },
      {
        title: 'APIs / CRM / data',
        summary: 'Connecting models to live APIs, CRMs, databases, and operational systems.',
      },
      {
        title: 'Production delivery',
        summary: 'Reliable full-stack delivery: testing, observability, and ownership in production.',
      },
    ],
  },
  proof: [
    {
      value: professionalTenure.short.replace(/ years$/, ''),
      label: professionalTenure.label,
    },
    {
      value: 'Millions',
      label: 'Marketplace products serving millions',
    },
    {
      value: '10M+',
      label: 'analytics data points',
    },
    {
      value: '25%',
      label: 'higher onboarding completion',
    },
  ],
  featuredWorkIntro:
    'Three representative cases: an AI-native booking system, marketplace reputation work, and a Directus website platform.',
  featuredCases: [
    {
      slug: 'ai-appointment-crm-automation',
      title: 'AI Appointment & CRM Automation',
      featured: true,
      problem:
        'Appointment booking and CRM updates needed live availability, identity checks, and human control over writes—not an unsupervised chatbot.',
      role: 'Independent full-stack AI engineer',
      contribution:
        'Built a multilingual LangGraph assistant for booking, rescheduling, and cancellation through Telegram, with live CRM availability and approval-controlled writes.',
      outcome:
        'A public, inspectable workflow that demonstrates controlled tool use and confirmation gates without implying automation at scale.',
      stack: ['LangGraph', 'Telegram', 'EspoCRM', 'Docker', 'Python', 'TypeScript'],
      href: 'https://github.com/slnnzmtl/langgraph-appointment-bot',
      hrefLabel: 'View flagship case',
    },
    {
      slug: 'upwork-reputation-team',
      title: 'Marketplace reputation',
      problem:
        'Reputation, credentialing, and enforcement UI on a large freelance marketplace needed end-to-end frontend ownership and modernization.',
      role: 'Senior Software Engineer, Reputation Team',
      contribution:
        'Owned frontend delivery for Partner Certified Talent and related reputation surfaces, and led Vue 2 to Vue 3 modernization of legacy modules.',
      outcome:
        'Production ownership on marketplace products serving millions of users, including PagerDuty on-call for reputation surfaces.',
      stack: ['Vue 3', 'Nuxt', 'TypeScript', 'Cursor', 'MCP'],
      href: experienceRolePath('upwork-reputation-team'),
      hrefLabel: 'View role details',
    },
    {
      slug: 'directus-website-builder',
      title: 'Directus Website Builder',
      problem:
        'Multilingual marketing sites needed block-based authoring, visual editing, and static generation without a custom CMS for every client.',
      role: 'Independent full-stack engineer',
      contribution:
        'Designed a Directus and Nuxt platform for multilingual block-based websites, visual editing, static generation, and optional AI-assisted page creation.',
      outcome:
        'A reusable, publicly inspectable architecture for subscription-ready content sites.',
      stack: ['Directus', 'Nuxt', 'TypeScript', 'Vue 3'],
      href: 'https://github.com/slnnzmtl/directus-website-builder',
      hrefLabel: 'View repository',
    },
  ],
  experiencePreview: {
    heading: 'Recent roles',
    items: homepageExperiencePreview(),
    cta: {
      label: 'View full timeline',
      href: '/experience',
    },
  },
  products: {
    heading: 'Products',
    description: 'Software I design, build, package, and maintain for real users.',
    items: [
      {
        slug: 'rekordbox-playlist-converter',
        title: 'Simple Rekordbox Converter',
        lead:
          'Convert Rekordbox 6/7 XML playlists and lossless tracks to WAV or AIFF without modifying your original files.',
        supportingLine:
          'Available as a universal macOS app, with a cross-platform Python CLI for macOS, Windows, and Linux.',
        image: {
          src: '/projects/rekordbox-playlist-converter/macos-app-main-window.webp',
          srcThumb: '/projects/rekordbox-playlist-converter/macos-app-main-window-600w.webp',
          srcset:
            '/projects/rekordbox-playlist-converter/macos-app-main-window-600w.webp 600w, /projects/rekordbox-playlist-converter/macos-app-main-window.webp 2240w',
          sizes: '(max-width: 768px) 100vw, 50vw',
          alt: 'Simple Rekordbox Converter main window with a Rekordbox XML loaded, Dark forest playlist selected, and WAV output settings',
          width: 2240,
          height: 1440,
        },
        cta: {
          label: 'View product',
          href: '/projects/rekordbox-playlist-converter',
        },
        tags: ['Python', 'Tkinter', 'FFmpeg', 'PyInstaller', 'Rekordbox XML'],
      },
    ],
  },
  contact: {
    heading: 'Have a system that needs to ship?',
    summary:
      'I help teams build AI-native products, connect agents to real business workflows, and ship reliable full-stack systems.',
    email: {
      label: 'Email',
      href: 'mailto:kazanskydaniel@gmail.com',
    },
    telegram: {
      label: 'Telegram',
      href: 'https://t.me/slnnzmtl',
    },
  },
}

export type HomepageHrefKind = 'native' | 'route'

export type ConversionEventName
  = 'flagship-case-open'
    | 'case-open'
    | 'product-open'
    | 'contact'

/** `native` = plain `<a>` (https, mailto). `route` = in-app `NuxtLink` (paths and hashes). */
export function homepageHrefKind(href: string): HomepageHrefKind {
  return /^(?:https?:|mailto:)/i.test(href) ? 'native' : 'route'
}

export function inAppLocation(
  href: string,
  currentPath = '/',
): string | { path: string, hash: string } {
  if (href.startsWith('#')) return { path: currentPath, hash: href }
  const hashIndex = href.indexOf('#')
  if (hashIndex === -1) return href
  return {
    path: href.slice(0, hashIndex) || '/',
    hash: href.slice(hashIndex),
  }
}

export function opensInNewTab(href: string): boolean {
  return /^https?:/i.test(href)
}

export function externalLinkRel(href: string): string | undefined {
  return opensInNewTab(href) ? 'noopener noreferrer' : undefined
}

export function isContactHref(href: string): boolean {
  return /^mailto:/i.test(href)
    || /^https?:\/\/(?:www\.)?t\.me\//i.test(href)
    || href === '#contact'
}

/** Map homepage CTAs to the four Umami events. Hash-only nav anchors return null. */
export function conversionEventName(
  href: string,
  options?: { featured?: boolean, product?: boolean },
): ConversionEventName | null {
  if (isContactHref(href)) return 'contact'
  if (options?.product) return 'product-open'
  if (options?.featured) return 'flagship-case-open'
  if (href === '#flagship-case') return null
  if (/^https?:/i.test(href) || homepageHrefKind(href) === 'route') {
    return 'case-open'
  }
  return null
}
