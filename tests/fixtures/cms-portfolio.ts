import type { CmsPortfolioRaw } from '~/utils/cms/types'

/**
 * Golden CMS payload matching landing-page-hosting@ffa560f8 seed.
 * Used by mapper tests and as the expected shape for cms:verify.
 */
export const cmsPortfolioFixture: CmsPortfolioRaw = {
  site: {
    status: 'published',
    person_name: 'Daniel Kazansky',
    person_role: 'AI-Native Full-Stack Engineer',
    value_proposition:
      'I build reliable AI-enabled products connecting models to APIs, CRMs, databases, and real operations—backed by 8+ years across digital products and software delivery.',
    professional_tenure: {
      short: '8+ years',
      label: 'years across digital products',
      heroSubtitle: '8+ years across digital products and software delivery',
      softwareEngineeringSince: 'Building software since 2019',
      pageIntro:
        'Evidence-based timeline from media and web delivery through frontend and full-stack engineering, senior production ownership, and AI-native systems.',
    },
    primary_ctas: [
      { label: 'View flagship case', href: '#flagship-case' },
      { label: 'Discuss a project', href: '#contact' },
    ],
    profile_links: [
      { label: 'GitHub', href: 'https://github.com/slnnzmtl' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/daniel-kazansky/' },
    ],
    hero_focus: {
      heading: 'Current focus',
      items: [
        {
          title: 'Agent workflows',
          summary:
            'Tool-using agents with persistence, authorization, and human approval for consequential actions.',
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
    featured_work_intro:
      'Three representative cases: an AI-native booking system, marketplace reputation work, and a Directus website platform.',
    featured_project_slugs: [
      'ai-appointment-crm-automation',
      'upwork-reputation-team',
      'directus-website-builder',
    ],
    experience_preview_heading: 'Recent roles',
    experience_preview_ids: [
      'upwork-reputation-team',
      'subbly-senior-software-developer',
      'woki-lead-software-developer',
    ],
    experience_preview_cta: {
      label: 'View full timeline',
      href: '/experience',
    },
    products_heading: 'Products',
    products_description: 'Software I design, build, package, and maintain for real users.',
    product_spotlight_slugs: ['rekordbox-playlist-converter'],
    proof_claim_ids: [
      'homepage-proof-marketplace-millions',
      'homepage-proof-analytics-10m',
      'homepage-proof-onboarding-25',
    ],
    contact_heading: 'Have a system that needs to ship?',
    contact_summary:
      'I help teams build AI-native products, connect agents to real business workflows, and ship reliable full-stack systems.',
    contact_email: 'kazanskydaniel@gmail.com',
    contact_telegram: 'https://t.me/slnnzmtl',
    menu: [
      { label: 'Work', href: '/' },
      { label: 'Experience', href: '/experience' },
      { label: 'Products', href: '/projects' },
      { label: 'Contact', href: '/#contact' },
      { label: 'GitHub', href: 'https://github.com/slnnzmtl' },
    ],
  },
  experience: [
    {
      id: 'exp-independent',
      key: 'independent-ai-fullstack',
      status: 'published',
      sort: 0,
      organization: 'Independent',
      title: 'Full Stack AI Developer',
      engagement_type: 'independent',
      location: 'Remote',
      work_mode: 'remote',
      start: '2024-01',
      end: null,
      scope:
        'Independent full-stack work on AI-native systems: Telegram assistants, CRM-connected booking flows, and controlled tool use with explicit approval and persistence.',
      contributions: [
        { text: 'Built a multilingual LangGraph appointment bot for booking, rescheduling, and cancellation through Telegram with live CRM availability.' },
        { text: 'Implemented identity checks, approval-controlled writes, and persistence so consequential actions require explicit confirmation.' },
        { text: 'Packaged delivery with Docker and automated tests around tool-using agent workflows.' },
      ],
      outcomes: [
        { claim_id: 'independent-ai-fullstack-outcome-1', qualifier: 'personal' },
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
      icon: null,
      icon_alt: null,
      homepage_summary: null,
    },
    {
      id: 'exp-upwork',
      key: 'upwork-reputation-team',
      status: 'published',
      sort: 1,
      organization: 'Upwork',
      title: 'Senior Software Engineer (Reputation Team)',
      engagement_type: 'contractor',
      location: 'Remote',
      work_mode: 'remote',
      start: '2025-01',
      end: '2026-05',
      scope:
        'Embedded long-term contractor on the Reputation team, owning marketplace reputation and enforcement UI domains end-to-end with PagerDuty production responsibility.',
      contributions: [
        { text: 'Owned frontend delivery for Partner Certified Talent and Freelancer Aggregated Strengths across Profiles, Search, and Onboarding.' },
        { text: 'Contributed to the Job Success Dashboard migration to a new evaluation model.' },
        { text: 'Led Vue 2 to Vue 3 modernization of legacy reputation UI modules.' },
        { text: 'Designed an AI-assisted development workflow with Cursor, Claude Code, and MCP integrations for Figma, Linear, GitHub, and Confluence.' },
      ],
      outcomes: [
        { claim_id: 'upwork-reputation-team-outcome-1', qualifier: 'platform' },
        { claim_id: 'upwork-reputation-team-outcome-2', qualifier: 'personal' },
      ],
      technologies: ['Vue 3', 'Nuxt', 'TypeScript', 'Cursor', 'MCP'],
      icon: 'file-upwork',
      icon_alt: 'Upwork',
      homepage_summary:
        'Built and modernized reputation, credentialing, and enforcement experiences across a marketplace serving tens of millions of users. Owned frontend domains end-to-end and supported production systems through on-call responsibilities.',
    },
    {
      id: 'exp-subbly',
      key: 'subbly-senior-software-developer',
      status: 'published',
      sort: 2,
      organization: 'Subbly®',
      title: 'Senior Software Developer',
      engagement_type: 'full-time',
      location: 'Remote',
      work_mode: 'remote',
      start: '2023-11',
      end: '2024-12',
      scope:
        'Subscription commerce product engineering spanning merchant setup UX, AI-assisted onboarding, checkout, and a flexible design system.',
      contributions: [
        { text: 'Refactored subscription setup UX to shorten merchant time-to-configure.' },
        { text: 'Developed an AI-powered onboarding chatbot for merchant activation flows.' },
        { text: 'Optimized cart and payment flows to reduce abandonment.' },
        { text: 'Built a custom design system for reusable storefront and admin UI.' },
      ],
      outcomes: [
        { claim_id: 'subbly-senior-software-developer-outcome-1', qualifier: 'team' },
        { claim_id: 'subbly-senior-software-developer-outcome-2', qualifier: 'team' },
      ],
      technologies: ['TypeScript', 'Vue'],
      icon: 'file-subbly',
      icon_alt: 'Subbly',
      homepage_summary:
        'Subscription commerce product engineering spanning setup UX, AI-assisted onboarding, and checkout. Reduced merchant setup time by 20%, raised AI-assisted onboarding completion by 25% for 500+ users, and cut payment abandonment by 15%.',
    },
    {
      id: 'exp-woki',
      key: 'woki-lead-software-developer',
      status: 'published',
      sort: 3,
      organization: 'Woki.one',
      title: 'Lead Software Developer in a startup',
      engagement_type: 'part-time',
      location: 'Remote',
      work_mode: 'remote',
      start: '2023-06',
      end: '2023-12',
      scope:
        'Led a four-person engineering team building a modular Vue 3 CRM with configurable UI under startup delivery pressure.',
      contributions: [
        { text: 'Led a 4-person team delivering a modular Vue 3 CRM architecture.' },
        { text: 'Engineered configurable UI features for customer-specific customization.' },
        { text: 'Drove frontend performance work to reach a 95+ Google PageSpeed score.' },
      ],
      outcomes: [
        { claim_id: 'woki-lead-software-developer-outcome-1', qualifier: 'team' },
        { claim_id: 'woki-lead-software-developer-outcome-2', qualifier: 'personal' },
      ],
      technologies: ['Vue 3', 'TypeScript'],
      icon: 'file-woki',
      icon_alt: 'Woki.one',
    },
    {
      id: 'exp-capgemini',
      key: 'capgemini-software-developer',
      status: 'published',
      sort: 4,
      organization: 'Capgemini Engineering',
      title: 'Software Developer',
      engagement_type: 'full-time',
      location: 'Remote',
      work_mode: 'remote',
      start: '2022-06',
      end: '2023-05',
      scope:
        'Built React/TypeScript/Redux analytics interfaces for enterprise marketing and forecasting in a Lerna monorepo.',
      contributions: [
        { text: 'Developed interactive dashboards handling large analytics payloads over HTTP.' },
        { text: 'Worked in a Lerna monorepo with shared React/TypeScript packages.' },
        { text: 'Supported marketing and forecasting workflows for enterprise clients.' },
      ],
      outcomes: [
        { claim_id: 'capgemini-software-developer-outcome-1', qualifier: 'platform' },
      ],
      technologies: ['React', 'TypeScript', 'Redux', 'Lerna'],
      icon: 'file-capgemini',
      icon_alt: 'Capgemini Engineering',
      homepage_summary:
        'Built interactive dashboards for a big data analytics system serving enterprise marketing and forecasting, managing 10M+ data points over HTTP in a React monorepo.',
    },
    {
      id: 'exp-kazansky',
      key: 'kazansky-dev-fullstack',
      status: 'published',
      sort: 5,
      organization: 'Kazansky.dev',
      title: 'Full Stack Developer',
      engagement_type: 'freelance',
      location: 'Remote',
      work_mode: 'remote',
      start: '2022-02',
      end: '2022-11',
      scope:
        'Freelance full-stack delivery with Vue and Vuex. Scope kept conservative: LinkedIn lists skills without a detailed public role description.',
      contributions: [
        { text: 'Delivered freelance full-stack features using Vue and Vuex.' },
        { text: 'Supported client web delivery as an independent contractor under Kazansky.dev.' },
      ],
      outcomes: [
        { claim_id: 'kazansky-dev-fullstack-outcome-1', qualifier: 'personal' },
      ],
      technologies: ['Vue', 'Vuex'],
    },
    {
      id: 'exp-malevich',
      key: 'malevich-frontend-developer',
      status: 'published',
      sort: 6,
      organization: 'Malevich',
      title: 'Frontend Developer',
      engagement_type: 'full-time',
      location: 'Remote',
      work_mode: 'remote',
      start: '2020-11',
      end: '2022-06',
      scope:
        'Frontend and mobile delivery for operational tooling, equipment scanning, and multilingual e-commerce on React, Next.js, GraphQL, and React Native/Expo.',
      contributions: [
        { text: 'Built React/GraphQL/Next.js operational tooling used by hundreds of daily operators.' },
        { text: 'Delivered a React Native/Expo panel for equipment scanning workflows.' },
        { text: 'Shipped a multilingual React/Redux e-commerce platform with Node.js backend collaboration.' },
      ],
      outcomes: [
        { claim_id: 'malevich-frontend-developer-outcome-1', qualifier: 'platform' },
      ],
      technologies: ['React', 'Next.js', 'GraphQL', 'React Native', 'Expo', 'Redux', 'Node.js'],
    },
    {
      id: 'exp-woman',
      key: 'woman-insight-web-developer',
      status: 'published',
      sort: 7,
      organization: 'Woman Insight Franchise',
      title: 'Web Developer',
      engagement_type: 'full-time',
      location: 'Odesa / Remote',
      work_mode: 'hybrid',
      start: '2019-03',
      end: '2020-10',
      scope:
        'Maintained a Vue.js and PHP Laravel franchise site with marketing automation, ad/email/CRM integrations, and custom quizzes over a large contact database.',
      contributions: [
        { text: 'Maintained Vue.js and PHP Laravel site features for franchise marketing.' },
        { text: 'Operated databases supporting 300K+ contacts with marketing automation workflows.' },
        { text: 'Integrated ads, email, and CRM systems; built custom quizzes for lead capture.' },
      ],
      outcomes: [
        { claim_id: 'woman-insight-web-developer-outcome-1', qualifier: 'platform' },
      ],
      technologies: ['Vue.js', 'PHP', 'Laravel', 'JavaScript'],
    },
    {
      id: 'exp-dals',
      key: 'dals-media-project-manager',
      status: 'published',
      sort: 8,
      organization: 'DALS Media',
      title: 'Project Manager',
      engagement_type: 'full-time',
      location: 'Odesa, Ukraine',
      work_mode: 'on-site',
      start: '2018-04',
      end: '2019-02',
      scope:
        'Managed and grew a network of media websites, using SEO to generate partner-campaign traffic alongside WordPress and frontend design work.',
      contributions: [
        { text: 'Managed a network of media websites and coordinated partner advertising campaigns.' },
        { text: 'Used SEO to generate traffic for partner campaigns.' },
        { text: 'Contributed WordPress and frontend design work across the media network.' },
      ],
      outcomes: [
        { claim_id: 'dals-media-project-manager-outcome-1', qualifier: 'team' },
      ],
      technologies: ['WordPress', 'SEO', 'HTML', 'CSS'],
    },
  ],
  projects: [
    {
      id: 'proj-ai',
      slug: 'ai-appointment-crm-automation',
      status: 'published',
      sort: 0,
      name: 'AI Appointment & CRM Automation',
      track: 'independent',
      role: 'Independent full-stack AI engineer',
      confidentiality_level: 'public',
      problem:
        'Appointment booking and CRM updates needed live availability, identity checks, and human control over writes—not an unsupervised chatbot.',
      contribution:
        'Built a multilingual LangGraph assistant for booking, rescheduling, and cancellation through Telegram, with live CRM availability and approval-controlled writes.',
      outcome:
        'A public, inspectable workflow that demonstrates controlled tool use and confirmation gates without implying automation at scale.',
      stack_tags: ['LangGraph', 'Telegram', 'EspoCRM', 'Docker', 'Python', 'TypeScript'],
      evidence_links: [
        {
          label: 'View flagship case',
          href: 'https://github.com/slnnzmtl/langgraph-appointment-bot',
        },
      ],
    },
    {
      id: 'proj-upwork',
      slug: 'upwork-reputation-team',
      status: 'published',
      sort: 1,
      name: 'Marketplace reputation',
      track: 'enterprise',
      role: 'Senior Software Engineer, Reputation Team',
      confidentiality_level: 'sanitized',
      experience_id: 'exp-upwork',
      problem:
        'Reputation, credentialing, and enforcement UI on a large freelance marketplace needed end-to-end frontend ownership and modernization.',
      contribution:
        'Owned frontend delivery for Partner Certified Talent and related reputation surfaces, and led Vue 2 to Vue 3 modernization of legacy modules.',
      outcome:
        'Production ownership on marketplace products serving millions of users, including PagerDuty on-call for reputation surfaces.',
      stack_tags: ['Vue 3', 'Nuxt', 'TypeScript', 'Cursor', 'MCP'],
      evidence_links: [
        {
          label: 'View role details',
          href: '/experience#upwork-reputation-team',
        },
      ],
    },
    {
      id: 'proj-directus',
      slug: 'directus-website-builder',
      status: 'published',
      sort: 2,
      name: 'Directus Website Builder',
      track: 'open_source_products',
      role: 'Independent full-stack engineer',
      confidentiality_level: 'public',
      problem:
        'Multilingual marketing sites needed block-based authoring, visual editing, and static generation without a custom CMS for every client.',
      contribution:
        'Designed a Directus and Nuxt platform for multilingual block-based websites, visual editing, static generation, and optional AI-assisted page creation.',
      outcome:
        'A reusable, publicly inspectable architecture for subscription-ready content sites.',
      stack_tags: ['Directus', 'Nuxt', 'TypeScript', 'Vue 3'],
      evidence_links: [
        {
          label: 'View repository',
          href: 'https://github.com/slnnzmtl/directus-website-builder',
        },
      ],
    },
  ],
  products: [
    {
      id: 'prod-rekordbox',
      slug: 'rekordbox-playlist-converter',
      status: 'published',
      sort: 0,
      name: 'Simple Rekordbox Converter',
      short_description: 'Convert Rekordbox XML playlists and lossless tracks to WAV or AIFF without changing your original files.',
      description: 'Simple Rekordbox Converter converts FLAC, ALAC, AIFF, and WAV tracks from Rekordbox 6 and 7 XML playlists into stereo PCM WAV or AIFF files. It generates new [WAV] or [AIFF] playlists for import back into Rekordbox while preserving the original audio files.\n\nThe project includes both an interactive Tkinter macOS application and a command-line interface for macOS, Linux, and Windows.',
      stack_tags: [
        'Python',
        'Tkinter',
        'FFmpeg',
        'FFprobe',
        'PyInstaller',
        'macOS',
        'unittest',
      ],
      logo: 'file-rekordbox-logo',
      social_image: 'file-rekordbox-social',
      benefits: [
        {
          title: 'Rekordbox 6 and 7 XML export/import workflow',
          description: 'Export a collection XML, convert playlists, then import the generated [WAV] or [AIFF] playlist through Imported Library.',
        },
        {
          title: 'WAV and AIFF output',
          description: 'Stereo PCM output with quality ceilings that never upsample beyond the source.',
        },
        {
          title: 'FLAC, ALAC, AIFF, and WAV input',
          description: 'Reads lossless sources from the Rekordbox XML without moving or overwriting originals.',
        },
        {
          title: 'Metadata support',
          description: 'Preserves cues, beatgrid, rating, BPM, and tags in the generated import XML.',
        },
        {
          title: '16/24-bit and 44.1/48 kHz quality ceilings',
          description: 'Bitrate and sample-rate settings cap output; sources below the ceiling stay unchanged.',
        },
        {
          title: 'No source-file modification',
          description: 'Converted audio is written to a separate output folder.',
        },
        {
          title: 'Dry-run and conversion preview modes',
          description: 'Review transcode, copy, and reuse decisions before anything is written.',
        },
        {
          title: 'Conflict detection and rerun handling',
          description: 'Skips or reuses existing outputs safely when you rerun a batch.',
        },
        {
          title: 'Universal Intel/Apple Silicon macOS app',
          description: 'Shipped as a universal2 macOS build with an interactive Tkinter UI.',
        },
        {
          title: 'GitHub Actions CI and automated tests',
          description: 'Release builds and unit tests run in CI before publication.',
        },
        {
          title: 'Optional anonymous analytics',
          description: 'Privacy-preserving usage analytics you can enable separately; not required to convert playlists.',
        },
      ],
      launch: {
        lead: 'Convert Rekordbox XML playlists and lossless tracks to WAV or AIFF without changing your original files.',
        supportingLine: 'Download the universal macOS app, or use the Python CLI on macOS, Windows, and Linux.',
        macosDownloadWarning: 'On first open do right click -> open because the app is ad hoc signed',
        ctas: [
          {
            label: 'Download for macOS',
            href: 'https://github.com/slnnzmtl/rekordbox-playlist-converter/releases',
            kind: 'primary',
            macosDownload: true,
          },
          {
            label: 'Other platforms',
            href: 'https://github.com/slnnzmtl/rekordbox-playlist-converter/releases',
            kind: 'secondary',
          },
        ],
        trustFacts: [
          {
            label: 'macOS',
            value: '11 (Big Sur)+ · universal2',
          },
          {
            label: 'License',
            value: 'GNU GPL v3',
            href: 'https://www.gnu.org/licenses/gpl-3.0.html',
          },
          {
            label: 'Privacy',
            value: 'Optional; not required to convert',
          },
          {
            label: 'Issues',
            value: 'GitHub',
            href: 'https://github.com/slnnzmtl/rekordbox-playlist-converter/issues',
          },
        ],
        trademark: 'Rekordbox is a trademark of AlphaTheta Corporation / Pioneer DJ. This unofficial tool is not affiliated with, endorsed by, or sponsored by AlphaTheta or Pioneer DJ.',
      },
      guide: {
        title: 'How to use',
        warning: 'Do not use File → Import. Point Imported Library at the generated rekordbox-import.xml, then bring in the [WAV] or [AIFF] playlist from the rekordbox xml pane.',
        steps: [
          {
            title: 'Export from Rekordbox',
            body: 'Wait until analysis has finished on the tracks you care about. Rekordbox 7: Preferences → Advanced → rekordbox xml → enable Export BeatGrid information. Then File → Export Collection in xml format and save locally (for example Documents/rekordbox). Avoid iCloud or Dropbox for a large export if you can.',
          },
          {
            title: 'Convert in the app',
            body: 'Browse to the collection XML, pick playlists and tracks, confirm the output folder, choose WAV or AIFF and the quality ceilings, then Convert. Originals stay put. Import XML is always written as rekordbox-import.xml in that output folder.',
            image: {
              src: '/projects/rekordbox-playlist-converter/macos-app-main-window.webp',
              srcThumb: '/projects/rekordbox-playlist-converter/macos-app-main-window-600w.webp',
              srcset: '/projects/rekordbox-playlist-converter/macos-app-main-window-600w.webp 600w, /projects/rekordbox-playlist-converter/macos-app-main-window.webp 2240w',
              sizes: '(max-width: 1024px) 100vw, 56rem',
              alt: 'Simple Rekordbox Converter main window with a Rekordbox XML loaded, a playlist selected, and WAV output settings',
              width: 2240,
              height: 1440,
            },
          },
          {
            title: 'Confirm the preview',
            body: 'Convert opens a preview first (action, reason, quality, size). Back writes nothing. Convert starts the batch. Conflicts — destination files changed outside this app — block Convert until you resolve them.',
            image: {
              src: '/projects/rekordbox-playlist-converter/macos-app-conversion-preview.webp',
              srcThumb: '/projects/rekordbox-playlist-converter/macos-app-conversion-preview-600w.webp',
              srcset: '/projects/rekordbox-playlist-converter/macos-app-conversion-preview-600w.webp 600w, /projects/rekordbox-playlist-converter/macos-app-conversion-preview.webp 1920w',
              sizes: '(max-width: 1024px) 100vw, 56rem',
              alt: 'Conversion preview listing tracks as transcode, copy, or reuse with bit depth, sample rate, and size',
              width: 1920,
              height: 1080,
            },
          },
          {
            title: 'Import into Rekordbox',
            body: 'Show the rekordbox xml pane (Preferences → View → Layout → Media Browser). Set Imported Library to rekordbox-import.xml — not the original collection export. Refresh if needed, then import the [WAV] or [AIFF] playlist from rekordbox xml → Playlists. Choose Yes if asked to load information from the library being imported.',
          },
          {
            title: 'Edit Import XML',
            body: 'When a generated library already exists, Edit appears beside the Import XML path. Right-click tracks or playlists to Reveal in Finder, remove from playlist, or Move to Trash. Save commits the draft; Cancel discards it. Convert is locked while you are editing.',
            image: {
              src: '/projects/rekordbox-playlist-converter/macos-app-import-xml-edit.webp',
              srcThumb: '/projects/rekordbox-playlist-converter/macos-app-import-xml-edit-600w.webp',
              srcset: '/projects/rekordbox-playlist-converter/macos-app-import-xml-edit-600w.webp 600w, /projects/rekordbox-playlist-converter/macos-app-import-xml-edit.webp 1120w',
              sizes: '(max-width: 1024px) 100vw, 56rem',
              alt: 'Import XML edit mode with multi-select and a context menu for Reveal in Finder, Remove from playlist, and Move to Trash',
              width: 1120,
              height: 748,
            },
          },
        ],
      },
      github: {
        owner: 'slnnzmtl',
        repo: 'rekordbox-playlist-converter',
      },
      seo: {
        title: 'Simple Rekordbox Converter',
        titleSuffix: 'Daniel Kazansky',
        description: 'Convert Rekordbox 6 and 7 XML playlists of FLAC, ALAC, AIFF, and WAV tracks to stereo PCM WAV or AIFF with a macOS app or cross-platform CLI.',
      },
      software_application: {
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'macOS, Linux, Windows',
        license: 'https://www.gnu.org/licenses/gpl-3.0.html',
      },
      evidence_links: null,
    },
  ],

  claims: [
    {
      id: 'claim-proof-1',
      key: 'homepage-proof-marketplace-millions',
      public_wording: 'Millions — Marketplace products serving millions',
      status: 'published',
    },
    {
      id: 'claim-proof-2',
      key: 'homepage-proof-analytics-10m',
      public_wording: '10M+ — analytics data points',
      status: 'published',
    },
    {
      id: 'claim-proof-3',
      key: 'homepage-proof-onboarding-25',
      public_wording: '25% — higher onboarding completion',
      status: 'published',
    },
    {
      id: 'claim-ind-1',
      key: 'independent-ai-fullstack-outcome-1',
      public_wording:
        'Public LangGraph Appointment Bot demonstrates controlled tool use, live availability, and approval gates—without implying automation at scale.',
      status: 'published',
    },
    {
      id: 'claim-up-1',
      key: 'upwork-reputation-team-outcome-1',
      public_wording:
        'Primary frontend ownership on Partner Certified Talent work reaching a marketplace with millions of freelancers (platform scale, not personal headcount).',
      status: 'published',
    },
    {
      id: 'claim-up-2',
      key: 'upwork-reputation-team-outcome-2',
      public_wording:
        'Held PagerDuty on-call responsibility for production reputation surfaces.',
      status: 'published',
    },
    {
      id: 'claim-sub-1',
      key: 'subbly-senior-software-developer-outcome-1',
      public_wording:
        '20% faster merchant setup and 25% higher AI-assisted onboarding completion for 500+ merchants/users.',
      status: 'published',
    },
    {
      id: 'claim-sub-2',
      key: 'subbly-senior-software-developer-outcome-2',
      public_wording: '15% lower cart and payment abandonment.',
      status: 'published',
    },
    {
      id: 'claim-woki-1',
      key: 'woki-lead-software-developer-outcome-1',
      public_wording: 'Delivered a modular Vue 3 CRM with configurable UI for the product.',
      status: 'published',
    },
    {
      id: 'claim-woki-2',
      key: 'woki-lead-software-developer-outcome-2',
      public_wording: 'Reached a 95+ Google PageSpeed score on primary CRM surfaces.',
      status: 'published',
    },
    {
      id: 'claim-cap-1',
      key: 'capgemini-software-developer-outcome-1',
      public_wording:
        'Analytics interfaces handling 10M+ data points over HTTP (platform/system scale).',
      status: 'published',
    },
    {
      id: 'claim-kaz-1',
      key: 'kazansky-dev-fullstack-outcome-1',
      public_wording:
        'Completed a multi-month freelance engagement delivering Vue/Vuex client work.',
      status: 'published',
    },
    {
      id: 'claim-mal-1',
      key: 'malevich-frontend-developer-outcome-1',
      public_wording: 'Operational tooling serving 500+ daily users (platform scale).',
      status: 'published',
    },
    {
      id: 'claim-wom-1',
      key: 'woman-insight-web-developer-outcome-1',
      public_wording:
        'Supported marketing systems over a database of 300K+ contacts (platform scale).',
      status: 'published',
    },
    {
      id: 'claim-dals-1',
      key: 'dals-media-project-manager-outcome-1',
      public_wording:
        'Grew partner-campaign traffic through SEO across the media-site network.',
      status: 'published',
    },
  ],
  files: [
    {
      id: 'file-upwork',
      filename_download: 'upwork.png',
      title: '/images/experience/upwork.png',
    },
    {
      id: 'file-subbly',
      filename_download: 'subbly.png',
      title: '/images/experience/subbly.png',
    },
    {
      id: 'file-woki',
      filename_download: 'woki.png',
      title: '/images/experience/woki.png',
    },
    {
      id: 'file-capgemini',
      filename_download: 'capgemini.png',
      title: '/images/experience/capgemini.png',
    },
    {
      id: 'file-rekordbox-logo',
      filename_download: 'simple-rekordbox-converter-logo.webp',
      title: '/projects/rekordbox-playlist-converter/simple-rekordbox-converter-logo.webp',
    },
    {
      id: 'file-rekordbox-logo-256w',
      filename_download: 'simple-rekordbox-converter-logo-256w.webp',
      title: '/projects/rekordbox-playlist-converter/simple-rekordbox-converter-logo-256w.webp',
    },
    {
      id: 'file-rekordbox-social',
      filename_download: 'simple-rekordbox-converter-social.webp',
      title: '/projects/rekordbox-playlist-converter/simple-rekordbox-converter-social.webp',
    },
    {
      id: 'file-rekordbox-main',
      filename_download: 'macos-app-main-window.webp',
      title: '/projects/rekordbox-playlist-converter/macos-app-main-window.webp',
    },
    {
      id: 'file-rekordbox-main-600w',
      filename_download: 'macos-app-main-window-600w.webp',
      title: '/projects/rekordbox-playlist-converter/macos-app-main-window-600w.webp',
    },
    {
      id: 'file-rekordbox-preview',
      filename_download: 'macos-app-conversion-preview.webp',
      title: '/projects/rekordbox-playlist-converter/macos-app-conversion-preview.webp',
    },
    {
      id: 'file-rekordbox-preview-600w',
      filename_download: 'macos-app-conversion-preview-600w.webp',
      title: '/projects/rekordbox-playlist-converter/macos-app-conversion-preview-600w.webp',
    },
    {
      id: 'file-rekordbox-edit',
      filename_download: 'macos-app-import-xml-edit.webp',
      title: '/projects/rekordbox-playlist-converter/macos-app-import-xml-edit.webp',
    },
    {
      id: 'file-rekordbox-edit-600w',
      filename_download: 'macos-app-import-xml-edit-600w.webp',
      title: '/projects/rekordbox-playlist-converter/macos-app-import-xml-edit-600w.webp',
    },
  ],
}
