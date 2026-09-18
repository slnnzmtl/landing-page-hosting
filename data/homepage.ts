import { rekordboxPlaylistConverter } from '~/domains/projects/data/rekordbox-playlist-converter'
import type { ProjectLaunchCta } from '~/domains/projects/data/types'

export interface SourcedText {
  text: string
}

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
  description: SourcedText
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

export interface ProductSpotlightFact {
  label: string
  value: string
}

/** Same shape as project launch CTAs; resolved via GitHub when `macosDownload` is set */
export type ProductSpotlightCta = ProjectLaunchCta

export interface ProductSpotlight {
  slug: string
  title: string
  lead: string
  supportingLine: string
  image: ProductSpotlightImage
  facts: ProductSpotlightFact[]
  ctas: ProductSpotlightCta[]
  tags: string[]
  github: {
    owner: string
    repo: string
  }
}

export interface ProductsSection {
  heading: SourcedText
  description: SourcedText
  items: ProductSpotlight[]
}

export interface HomepageContent {
  person: {
    name: SourcedText
    role: SourcedText
    experience: SourcedText
    heroSubtitle: SourcedText
  }
  valueProposition: SourcedText
  workflow: SourcedText
  primaryCtas: HomepageLink[]
  profileLinks: HomepageLink[]
  proof: ProofItem[]
  workSections: WorkSection[]
  products: ProductsSection
  capabilities: Capability[]
  selectedWorkIntro: SourcedText
  contact: {
    heading: SourcedText
    summary: SourcedText
    email: HomepageLink
    telegram: HomepageLink
  }
}

export const homepageContent: HomepageContent = {
  person: {
    name: {
      text: 'Daniel Kazansky',
    },
    role: {
      text: 'AI-Native Full-Stack Engineer',
    },
    experience: {
      text: '8+ years',
    },
    heroSubtitle: {
      text: '8+ years shipping reliable products',
    },
  },
  valueProposition: {
    text: 'I build production software—from AI agents and workflow automation to full-stack applications, CRM integrations, and data-heavy interfaces.',
  },
  workflow: {
    text: 'The work connects LLMs to APIs, databases, CRMs, messaging platforms, and real business workflows — with explicit tool boundaries and human approval for consequential actions.',
  },
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
      label: 'Years shipping production software',
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
      description: {
        text:
          'Product engineering within commercial teams, working on marketplace, analytics, and SaaS platforms.',
      },
      items: [
        {
          slug: 'upwork-reputation-team',
          title: 'Senior Software Engineer (Reputation Team)',
          subtitle: 'Upwork · Jan 2025 – May 2026 · Remote',
          icon: '/images/experience/upwork.png',
          iconAlt: 'Upwork',
          summary:
            'Built and modernized reputation, credentialing, and enforcement experiences across a marketplace serving tens of millions of users. Owned frontend domains end-to-end and supported production systems through on-call responsibilities.',
        },
        {
          slug: 'subbly-senior-software-developer',
          title: 'Senior Software Developer',
          subtitle: 'Subbly® · Full-time · Nov 2023 – Dec 2024 · Remote',
          icon: '/images/experience/subbly.png',
          iconAlt: 'Subbly',
          summary:
            'Subscription commerce product engineering spanning setup UX, AI-assisted onboarding, and checkout. Reduced merchant setup time by 20%, raised AI-assisted onboarding completion by 25% for 500+ users, and cut payment abandonment by 15%.',
        },
        {
          slug: 'capgemini-software-developer',
          title: 'Software Developer',
          subtitle: 'Capgemini Engineering · Full-time · Jun 2022 – May 2023 · Remote',
          icon: '/images/experience/capgemini.png',
          iconAlt: 'Capgemini Engineering',
          summary:
            'Built interactive dashboards for a big data analytics system serving enterprise marketing and forecasting, managing 10M+ data points over HTTP in a React monorepo.',
        },
      ],
    },
    {
      id: 'independent',
      title: 'Independent Work',
      description: {
        text:
          'End-to-end delivery of client systems, automations, and AI-native workflows.',
      },
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
      description: {
        text:
          'Publicly inspectable systems, reusable architectures, and developer tools demonstrating how I design and build software.',
      },
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
    heading: {
      text: 'Products',
    },
    description: {
      text: 'Software I design, build, package, and maintain for real users.',
    },
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
        facts: [
          {
            label: 'Platforms',
            value: 'Universal macOS app · CLI on macOS, Windows, and Linux',
          },
          {
            label: 'Formats',
            value: 'WAV and AIFF output',
          },
        ],
        ctas: [
          {
            label: 'Download for macOS',
            href: 'https://github.com/slnnzmtl/rekordbox-playlist-converter/releases',
            kind: 'primary',
            macosDownload: true,
          },
          {
            label: 'View product',
            href: '/projects/rekordbox-playlist-converter',
            kind: 'secondary',
          },
          {
            label: 'Documentation',
            href: 'https://github.com/slnnzmtl/rekordbox-playlist-converter/blob/master/USAGE.md',
            kind: 'secondary',
          },
          {
            label: 'Source code',
            href: 'https://github.com/slnnzmtl/rekordbox-playlist-converter',
            kind: 'secondary',
          },
        ],
        tags: ['Python', 'Tkinter', 'FFmpeg', 'PyInstaller', 'Rekordbox XML'],
        github: rekordboxPlaylistConverter.github!,
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
  selectedWorkIntro: {
    text:
      'Commercial product engineering, independent delivery, and publicly inspectable open-source systems.',
  },
  contact: {
    heading: {
      text: 'Have a system that needs to ship?',
    },
    summary: {
      text:
        'I help teams build AI-native products, connect agents to real business workflows, and ship reliable full-stack systems.',
    },
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

export function publishedHomepage(content: HomepageContent = homepageContent): HomepageContent {
  return {
    ...content,
    primaryCtas: content.primaryCtas,
    profileLinks: content.profileLinks,
    proof: content.proof,
    workSections: content.workSections,
    products: {
      heading: content.products.heading,
      description: content.products.description,
      items: content.products.items,
    },
    capabilities: content.capabilities,
  }
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
