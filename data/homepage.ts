import { homepageProfessionalCards, professionalTenure } from './experience'

export interface HomepageLink {
  label: string
  href: string
}

export interface ProofItem {
  value: string
  label: string
}

export type WorkSectionId = 'professional' | 'independent' | 'open-source'

export interface WorkCard {
  slug: string
  title: string
  summary: string
  href?: string
  hrefLabel?: string
  /** LinkedIn-style meta line, e.g. company · dates · location */
  subtitle?: string
  /** Public path to a company/product icon shown beside the title */
  icon?: string
  /** Accessible label for the icon; defaults to title */
  iconAlt?: string
  tags?: string[]
  featured?: boolean
}

export interface WorkSection {
  id: WorkSectionId
  title: string
  description: string
  items: WorkCard[]
}

export interface Capability {
  title: string
  summary: string
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
    experience: string
    heroSubtitle: string
  }
  valueProposition: string
  primaryCtas: HomepageLink[]
  profileLinks: HomepageLink[]
  proof: ProofItem[]
  workSections: WorkSection[]
  products: ProductsSection
  capabilities: Capability[]
  selectedWorkIntro: string
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
    experience: professionalTenure.short,
    heroSubtitle: professionalTenure.heroSubtitle,
  },
  valueProposition:
    'I build production software—from AI agents and workflow automation to full-stack applications, CRM integrations, and data-heavy interfaces.',
  primaryCtas: [
    {
      label: 'Selected work',
      href: '#selected-work',
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
  proof: [
    {
      value: '8+',
      label: professionalTenure.label,
    },
    {
      value: '20M+',
      label: 'Active users on marketplace products I contributed to',
    },
    {
      value: '10M+',
      label: 'Data points processed in enterprise analytics systems',
    },
    {
      value: '25%',
      label: 'Higher AI-assisted onboarding completion for 500+ users',
    },
  ],
  workSections: [
    {
      id: 'professional',
      title: 'Professional Experience',
      description:
        'Product engineering within commercial teams, working on marketplace, analytics, and SaaS platforms.',
      items: homepageProfessionalCards(),
    },
    {
      id: 'independent',
      title: 'Independent Work',
      description:
        'End-to-end delivery of client systems, automations, and AI-native workflows.',
      items: [
        {
          slug: 'ai-appointment-crm-automation',
          title: 'AI Appointment & CRM Automation',
          summary:
            'Multilingual LangGraph assistant for booking, rescheduling, and cancellation through Telegram, with live CRM availability, identity checks, and approval-controlled writes.',
          href: 'https://github.com/slnnzmtl/langgraph-appointment-bot',
          hrefLabel: 'View project',
          featured: true,
        },
        {
          slug: 'woki-crm',
          title: 'Woki CRM',
          subtitle: 'Woki.one · Part-time · Jun 2023 – Dec 2023 · Remote',
          summary:
            'Led a 4-person team in a fast-paced startup to build a modular CRM system using Vue 3 under tight deadlines.\nAchieving a 95+ Google PageSpeed score.\nEngineered user-friendly, configurable features for seamless customization.',
        },
        {
          slug: 'kml-map-viewer',
          title: 'KML Map Viewer',
          summary:
            'Full-stack mapping and spatial-data platform with Google Maps integration, Laravel, Vue, and location-based workflows.',
          href: '#contact',
          hrefLabel: 'View project',
        },
      ],
    },
    {
      id: 'open-source',
      title: 'Open-Source Engineering',
      description:
        'Publicly inspectable systems, reusable architectures, and developer tools demonstrating how I design and build software.',
      items: [
        {
          slug: 'langgraph-personal-assistant',
          title: 'LangGraph Personal Assistant',
          summary:
            'Persistent multi-agent assistant that routes tasks across specialist agents, tools, schedules, and external services.',
          href: 'https://github.com/slnnzmtl/langgraph-personal-assistant',
          hrefLabel: 'View repository',
        },
        {
          slug: 'directus-website-builder',
          title: 'Directus Website Builder',
          summary:
            'Full-stack Directus and Nuxt platform for multilingual block-based websites, visual editing, static generation, and optional AI-assisted page creation.',
          href: 'https://github.com/slnnzmtl/directus-website-builder',
          hrefLabel: 'View repository',
        },
      ],
    },
  ],
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
  capabilities: [
    {
      title: 'Agentic AI systems',
      summary:
        'Tool-using LangGraph agents with persistence, authorization, failure handling, and human approval for consequential actions.',
    },
    {
      title: 'Full-stack product engineering',
      summary:
        'TypeScript and Python applications spanning interfaces, APIs, databases, integrations, and deployment.',
    },
    {
      title: 'Production product engineering',
      summary:
        'Reliable delivery for commercial products: modernization, observability, testing, maintainable architecture, and production ownership.',
    },
  ],
  selectedWorkIntro:
    'Commercial product engineering, independent delivery, and publicly inspectable open-source systems.',
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

/** `native` = plain `<a>` (https, mailto, hash). `route` = in-app `NuxtLink`. */
export function homepageHrefKind(href: string): HomepageHrefKind {
  return /^(?:https?:|mailto:|#)/i.test(href) ? 'native' : 'route'
}

export function opensInNewTab(href: string): boolean {
  return /^https?:/i.test(href)
}

export function externalLinkRel(href: string): string | undefined {
  return opensInNewTab(href) ? 'noopener noreferrer' : undefined
}
