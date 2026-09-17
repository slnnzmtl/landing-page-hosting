export type ClaimStatus = 'approved' | 'pending-validation' | 'internal-only'

export interface ClaimSource {
  /** Linear ticket, public repo, or approval note. Never shown on the page. */
  origin: string
  status: ClaimStatus
  note: string
}

export interface SourcedText {
  text: string
  source: ClaimSource
}

export interface HomepageLink {
  label: string
  href: string
  source: ClaimSource
}

export interface ProofItem {
  value: string
  label: string
  source: ClaimSource
}

export type WorkTrackId = 'enterprise' | 'independent' | 'open-source'

export interface WorkTrack {
  id: WorkTrackId
  title: string
  summary: string
  source: ClaimSource
}

export type WorkSectionId = 'professional' | 'independent' | 'products-open-source'

export interface WorkCard {
  slug: string
  title: string
  summary: string
  source: ClaimSource
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
  source: ClaimSource
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
  tracksIntro: SourcedText
  tracks: WorkTrack[]
  workSections: WorkSection[]
  capabilities: Capability[]
  selectedWorkIntro: SourcedText
  contact: {
    heading: SourcedText
    summary: SourcedText
    email: HomepageLink
  }
}

const ticket157: ClaimSource = {
  origin: 'https://linear.app/ddd7486/issue/DDD-157/rebuild-the-homepage-around-ai-native-full-stack-positioning',
  status: 'approved',
  note: 'Approved homepage positioning and proof facts in DDD-157.',
}

const ticket168: ClaimSource = {
  origin: 'https://linear.app/ddd7486/issue/DDD-168/add-independent-and-client-work-track',
  status: 'approved',
  note: 'Public-safe appointment/CRM case framing from DDD-168; no endpoints or client identity.',
}

const ticket169: ClaimSource = {
  origin: 'https://linear.app/ddd7486/issue/DDD-169/add-open-source-and-products-track-with-flagship-projects',
  status: 'approved',
  note: 'Flagship order and public repository links from DDD-169.',
}

const githubProfile: ClaimSource = {
  origin: 'https://github.com/slnnzmtl',
  status: 'approved',
  note: 'Public GitHub profile attached to DDD-157.',
}

const linkedInProfile: ClaimSource = {
  origin: 'https://www.linkedin.com/in/daniel-kazansky/',
  status: 'approved',
  note: 'Public LinkedIn profile attached to DDD-157. Used as the public CV and source for published professional experience roles.',
}

const rekordboxProduct: ClaimSource = {
  origin: 'domains/projects/data/rekordbox-playlist-converter.ts',
  status: 'approved',
  note: 'Published product copy already on /projects/rekordbox-playlist-converter.',
}

const directusReadme: ClaimSource = {
  origin: 'https://github.com/slnnzmtl/directus-website-builder',
  status: 'approved',
  note: 'Public repository description and README capabilities.',
}

const ticket167: ClaimSource = {
  origin: 'https://linear.app/ddd7486/issue/DDD-167/add-enterprise-work-track-and-sanitized-experience-case-studies',
  status: 'approved',
  note:
    'Sanitized enterprise marketplace, analytics, and subscription commerce framing from DDD-167; approved public metrics: 20% faster merchant setup, 25% higher AI-assisted onboarding completion for 500+ users, 15% lower payment abandonment.',
}

const independentClientWork: ClaimSource = {
  origin: 'https://linear.app/ddd7486/issue/DDD-168/add-independent-and-client-work-track',
  status: 'approved',
  note: 'Public-safe independent/client work framing from DDD-168; no unverified metrics or confidential client identity.',
}

export const homepageContent: HomepageContent = {
  person: {
    name: {
      text: 'Daniel Kazansky',
      source: ticket157,
    },
    role: {
      text: 'AI-Native Full-Stack Engineer',
      source: ticket157,
    },
    experience: {
      text: '8+ years',
      source: ticket157,
    },
    heroSubtitle: {
      text: '8+ years shipping production software; now focused on AI-native systems',
      source: ticket157,
    },
  },
  valueProposition: {
    text: 'I design and ship production software where language models are part of the stack, not a demo layer.',
    source: ticket157,
  },
  workflow: {
    text: 'The work connects LLMs to APIs, databases, CRMs, messaging platforms, and real business workflows — with explicit tool boundaries and human approval for consequential actions.',
    source: ticket157,
  },
  primaryCtas: [
    {
      label: 'Selected work',
      href: '#selected-work',
      source: ticket157,
    },
    {
      label: 'Discuss a project',
      href: '#contact',
      source: ticket157,
    },
  ],
  profileLinks: [
    {
      label: 'GitHub',
      href: 'https://github.com/slnnzmtl',
      source: githubProfile,
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/daniel-kazansky/',
      source: linkedInProfile,
    },
  ],
  proof: [
    {
      value: '8+',
      label: 'Years shipping production software',
      source: ticket157,
    },
    {
      value: '20M+',
      label: 'Active users on marketplace products I contributed to',
      source: ticket157,
    },
    {
      value: '10M+',
      label: 'Data points processed in enterprise analytics systems',
      source: ticket157,
    },
    {
      value: '25%',
      label: 'Higher AI-assisted onboarding completion for 500+ users',
      source: ticket167,
    },
  ],
  tracksIntro: {
    text:
      'Enterprise platforms, independent delivery, and inspectable products. Each track is a different kind of evidence.',
    source: ticket157,
  },
  tracks: [
    {
      id: 'enterprise',
      title: 'Enterprise',
      summary:
        'Product engineering on marketplace, analytics, and subscription platforms, described by role, scope, and approved outcomes.',
      source: ticket157,
    },
    {
      id: 'independent',
      title: 'Independent / Client Work',
      summary:
        'End-to-end delivery for founders and operators: CRM, automation, and AI-backed workflows without exposing customer identity or internals.',
      source: ticket157,
    },
    {
      id: 'open-source',
      title: 'Open Source & Products',
      summary:
        'Inspectable engineering: agentic systems, CMS-backed products, and shipped tools with public repositories or product pages.',
      source: ticket157,
    },
  ],
  workSections: [
    {
      id: 'professional',
      title: 'Professional Experience',
      description: {
        text:
          'Product engineering within commercial teams, working on marketplace, analytics, and SaaS platforms.',
        source: ticket157,
      },
      items: [
        {
          slug: 'upwork-reputation-team',
          title: 'Senior Software Engineer (Reputation Team)',
          subtitle: 'Upwork · Jan 2025 – May 2026 · Remote',
          icon: '/images/experience/upwork.png',
          iconAlt: 'Upwork',
          summary:
            'Embedded long-term contractor building marketplace reputation and enforcement UI at massive scale (tens of millions of active users). Owned high-impact product domains end-to-end and maintained PagerDuty on-call operational responsibility.\n\n- Core Feature Ownership: Successfully launched the Partner Certified Skills Program and the Freelancer Aggregated Strengths reputation engine across multiple high-traffic surfaces (Profiles, Search, Onboarding).\n\n- System Migration: Contributed to the platform-wide overhaul of the Job Success Dashboard, transitioning to a new evaluation scoring paradigm.\n\n- Technical Modernization: Led code refactoring efforts migrating legacy UI modules from Vue 2 to Vue 3 to optimize application architecture.\n\n- Cutting-Edge Productivity: Designed a state-of-the-art AI development workflow utilizing Cursor, Claude Code, and MCP integrations (Figma, Linear, GitHub, Confluence) to maximize engineering velocity and feature throughput.',
          source: linkedInProfile,
        },
        {
          slug: 'subbly-senior-software-developer',
          title: 'Senior Software Developer',
          subtitle: 'Subbly® · Full-time · Nov 2023 – Dec 2024 · Remote',
          icon: '/images/experience/subbly.png',
          iconAlt: 'Subbly',
          summary:
            'Refactored subscription setup UX, reducing merchant setup time by 20%, and developed an AI-powered onboarding chatbot, improving completion rates by 25% for 500+ users.\nOptimized cart and payment flows, cutting abandonment by 15%, and built a custom design system for flexibility.',
          source: ticket167,
          tags: ['TypeScript', 'Vue'],
        },
        {
          slug: 'woki-one-lead-software-developer',
          title: 'Lead Software Developer in a startup',
          subtitle: 'Woki.one · Part-time · Jun 2023 – Dec 2023 · Remote',
          icon: '/images/experience/woki.png',
          iconAlt: 'Woki.one',
          summary:
            'Led a 4-person team in a fast-paced startup to build a modular CRM system using Vue 3 under tight deadlines.\nAchieving a 95+ Google PageSpeed score.\nEngineered user-friendly, configurable features for seamless customization.',
          source: linkedInProfile,
          tags: ['Vue 2', 'Vue 3'],
        },
        {
          slug: 'capgemini-software-developer',
          title: 'Software Developer',
          subtitle: 'Capgemini Engineering · Full-time · Jun 2022 – May 2023 · Remote',
          icon: '/images/experience/capgemini.png',
          iconAlt: 'Capgemini Engineering',
          summary:
            'Developed a big data analytics system with React, TypeScript, and Redux, managing 10M+ data points over HTTP.\nBuilt interactive dashboards in a monorepo setup with Lerna, enabling efficient marketing and forecasting for enterprise clients.',
          source: linkedInProfile,
          tags: ['Redux', 'React'],
        },
      ],
    },
    {
      id: 'independent',
      title: 'Independent Work',
      description: {
        text:
          'End-to-end delivery of client systems, automations, and AI-native workflows.',
        source: ticket157,
      },
      items: [
        {
          slug: 'ai-appointment-crm-automation',
          title: 'AI Appointment & CRM Automation',
          summary:
            'Multilingual LangGraph assistant for booking, rescheduling, and cancellation through Telegram, with live CRM availability, identity checks, and approval-controlled writes.',
          href: 'https://github.com/slnnzmtl/langgraph-appointment-bot',
          hrefLabel: 'View project',
          source: ticket168,
          featured: true,
        },
        {
          slug: 'kml-map-viewer',
          title: 'KML Map Viewer',
          summary:
            'Full-stack mapping and spatial-data platform with Google Maps integration, Laravel, Vue, and location-based workflows.',
          href: '#contact',
          hrefLabel: 'View project',
          source: independentClientWork,
        },
      ],
    },
    {
      id: 'products-open-source',
      title: 'Products & Open Source',
      description: {
        text:
          'Public software, reusable systems, and products designed, built, tested, and released.',
        source: ticket157,
      },
      items: [
        {
          slug: 'langgraph-personal-assistant',
          title: 'LangGraph Personal Assistant',
          summary:
            'Persistent multi-agent assistant that routes tasks across specialist agents, tools, schedules, and external services.',
          href: 'https://github.com/slnnzmtl/langgraph-personal-assistant',
          hrefLabel: 'View repository',
          source: ticket169,
        },
        {
          slug: 'directus-website-builder',
          title: 'Directus Website Builder',
          summary:
            'Full-stack Directus and Nuxt platform for multilingual block-based websites, visual editing, static generation, and optional AI-assisted page creation.',
          href: 'https://github.com/slnnzmtl/directus-website-builder',
          hrefLabel: 'View repository',
          source: directusReadme,
        },
        {
          slug: 'rekordbox-playlist-converter',
          title: 'Simple Rekordbox Converter',
          summary:
            'Cross-platform Python CLI and universal macOS app for converting Rekordbox 6/7 XML playlists and lossless tracks into WAV or AIFF without modifying the original files.',
          href: '/projects/rekordbox-playlist-converter',
          hrefLabel: 'View product',
          source: rekordboxProduct,
          tags: [
            'Python',
            'Tkinter',
            'FFmpeg',
            'FFprobe',
            'PyInstaller',
            'macOS',
            'CLI',
            'Rekordbox XML',
            'GitHub Actions',
            'unittest',
          ],
        },
      ],
    },
  ],
  capabilities: [
    {
      title: 'Agentic AI systems',
      summary:
        'Tool-using LangGraph agents with persistence, authorization, failure handling, and human approval for consequential actions.',
      source: ticket157,
    },
    {
      title: 'Full-stack product engineering',
      summary:
        'TypeScript and Python applications spanning interfaces, APIs, databases, integrations, and deployment.',
      source: ticket157,
    },
    {
      title: 'Production product engineering',
      summary:
        'Reliable delivery for commercial products: modernization, observability, testing, maintainable architecture, and production ownership.',
      source: ticket157,
    },
  ],
  selectedWorkIntro: {
    text:
      'Enterprise product engineering, independent delivery, and public software built to solve real problems.',
    source: ticket157,
  },
  contact: {
    heading: {
      text: 'Have a system that needs to ship?',
      source: ticket157,
    },
    summary: {
      text:
        'I help teams build AI-native products, connect agents to real business workflows, and ship reliable full-stack systems.',
      source: ticket157,
    },
    email: {
      label: 'Email',
      href: 'mailto:kazanskydaniel@gmail.com',
      source: ticket157,
    },
  },
}

export function isApproved(source: ClaimSource): boolean {
  return source.status === 'approved'
}

export function collectClaimSources(content: HomepageContent): ClaimSource[] {
  return [
    content.person.name.source,
    content.person.role.source,
    content.person.experience.source,
    content.person.heroSubtitle.source,
    content.valueProposition.source,
    content.workflow.source,
    ...content.primaryCtas.map(item => item.source),
    ...content.profileLinks.map(item => item.source),
    ...content.proof.map(item => item.source),
    content.tracksIntro.source,
    ...content.tracks.map(item => item.source),
    ...content.workSections.flatMap(section => [
      section.description.source,
      ...section.items.map(item => item.source),
    ]),
    ...content.capabilities.map(item => item.source),
    content.selectedWorkIntro.source,
    content.contact.heading.source,
    content.contact.summary.source,
    content.contact.email.source,
  ]
}

export function publishedHomepage(content: HomepageContent = homepageContent): HomepageContent {
  return {
    ...content,
    primaryCtas: content.primaryCtas.filter(item => isApproved(item.source)),
    profileLinks: content.profileLinks.filter(item => isApproved(item.source)),
    proof: content.proof.filter(item => isApproved(item.source)),
    tracks: content.tracks.filter(item => isApproved(item.source)),
    workSections: content.workSections
      .filter(section => isApproved(section.description.source))
      .map(section => ({
        ...section,
        items: section.items.filter(item => isApproved(item.source)),
      }))
      .filter(section => section.items.length > 0),
    capabilities: content.capabilities.filter(item => isApproved(item.source)),
  }
}

export function trackTitle(tracks: WorkTrack[], id: WorkTrackId): string {
  return tracks.find(track => track.id === id)?.title ?? id
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
