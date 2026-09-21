import type { CmsPortfolioRaw } from '~/utils/cms/types'

/**
 * Synthetic CMS payload for mapper / unit tests only.
 * Invented names and slugs — not a copy of production Directus content.
 * Live inventory is checked by `pnpm cms:verify` against Directus directly.
 */
export const cmsPortfolioFixture: CmsPortfolioRaw = {
  site: {
    status: 'published',
    person_name: 'Ada Example',
    person_role: 'Full-Stack Engineer',
    menu: [
      { label: 'Work', href: '/' },
      { label: 'Experience', href: '/experience' },
      { label: 'Products', href: '/products' },
      { label: 'Contact', href: '/#contact' },
      { label: 'GitHub', href: 'https://github.com/example-org' },
    ],
    site_name: 'Example.dev',
    seo_title: 'Ada Example | Full-Stack Engineer',
    seo_description:
      'I build reliable products connecting APIs, CRMs, and operations.',
    og_image: null,
  },
  homepageSettings: {
    status: 'published',
    value_proposition:
      'I build reliable products connecting APIs, CRMs, and operations — with 5+ years across digital delivery.',
    primary_ctas: [
      {
        buttons_id: {
          status: 'published',
          label: 'View flagship case',
          href: '#flagship-case',
          type: 'primary',
          href_source: 'static',
        },
      },
      {
        buttons_id: {
          status: 'published',
          label: 'Discuss a project',
          href: '#contact',
          type: 'secondary',
          href_source: 'static',
        },
      },
    ],
    profile_links: [
      {
        buttons_id: {
          status: 'published',
          label: 'GitHub',
          href: 'https://github.com/example-org',
          type: 'link',
          href_source: 'static',
        },
      },
      {
        buttons_id: {
          status: 'published',
          label: 'LinkedIn',
          href: 'https://www.linkedin.com/in/ada-example/',
          type: 'link',
          href_source: 'static',
        },
      },
    ],
    hero_focus_heading: 'Current focus',
    hero_focus_items: [
      {
        title: 'Agent workflows',
        summary: 'Tool-using agents with persistence and approval gates.',
      },
      {
        title: 'APIs / CRM / data',
        summary: 'Connecting models to live APIs and operational systems.',
      },
    ],
    proof_heading: 'Selected outcomes',
    featured_work_heading: 'Featured work',
    featured_work_intro: 'One representative case from recent delivery.',
    flagship_label: 'Flagship case',
    featured_projects: [
      { projects_id: { slug: 'sample-flagship-case' } },
      { projects_id: { slug: 'sample-secondary-case' } },
    ],
    experience_preview_heading: 'Recent roles',
    experience_preview: [
      { experience_entries_id: { key: 'acme-senior-engineer' } },
    ],
    experience_preview_cta: {
      status: 'published',
      label: 'View full timeline',
      href: '/experience',
      type: 'link',
      href_source: 'static',
    },
    products_heading: 'Products',
    products_description: 'Software packaged and maintained for real users.',
    product_spotlights: [{ products_id: { slug: 'sample-converter' } }],
    proof_claims: [
      { approved_claims_id: { key: 'homepage-proof-tenure-years' } },
      { approved_claims_id: { key: 'homepage-proof-users' } },
    ],
    spotlight_cta: 'View product',
    contact_heading: 'Ready to ship?',
    contact_summary: 'I help teams build and ship reliable full-stack systems.',
    contact_links: [
      { label: 'Email', href: 'mailto:ada@example.test' },
      { label: 'Telegram', href: 'https://t.me/ada-example' },
    ],
  },
  experiencePage: {
    status: 'published',
    title: 'Professional experience',
    page_intro: 'Evidence-based timeline of product and software delivery.',
    back_label: 'Back to featured work',
    back_href: '/#featured-work',
    seo_description:
      'Professional timeline for Ada Example: digital products and software delivery.',
  },
  productsPage: {
    status: 'published',
    title: 'Products',
    description: 'Public products and tools with dedicated landing pages.',
    seo_description: 'Public products from Ada Example.',
    back_label: 'Back to homepage',
    back_href: '/',
    item_cta: 'View project',
    kicker: 'Product',
    detail_back_label: 'Back to products',
    detail_back_href: '/products',
    benefits_heading_with_stack: 'Feature highlights',
    benefits_heading_default: 'Why use it',
    trust_heading: 'Product information',
    download_warning_title: 'Before you open the app',
  },
  experience: [
    {
      id: 'exp-acme',
      key: 'acme-senior-engineer',
      status: 'published',
      sort: 0,
      organization: 'Acme Corp',
      title: 'Senior Software Engineer',
      engagement_type: 'full-time',
      location: 'Remote',
      work_mode: 'remote',
      start: '2022-01',
      end: null,
      scope: 'Full-stack ownership of customer-facing APIs and admin tooling.',
      contributions: [
        { text: 'Shipped CRM-connected booking flows with explicit approval gates.' },
        { text: 'Owned production observability and incident response for core APIs.' },
      ],
      outcomes: [
        { claim_id: 'acme-senior-engineer-outcome-1', qualifier: 'personal' },
      ],
      homepage_summary: 'Senior engineer on CRM-connected product systems.',
      technologies: ['TypeScript', 'Node.js', 'Postgres'],
      links: [
        {
          label: 'Public case',
          href: 'https://github.com/example-org/sample-flagship',
        },
      ],
      icon: 'file-acme-icon',
      icon_alt: 'Acme Corp logo',
    },
  ],
  projects: [
    {
      id: 'proj-flagship',
      slug: 'sample-flagship-case',
      status: 'published',
      sort: 0,
      name: 'Sample Flagship Case',
      role: 'Lead engineer',
      short_description: 'AI-assisted booking connected to a live CRM.',
      problem: 'Manual booking clogged support queues.',
      contribution: 'Designed agent workflows with approval-controlled writes.',
      outcome: 'Support tickets for booking dropped by a measurable share.',
      stack_tags: ['TypeScript', 'LangGraph'],
      evidence_links: [
        {
          label: 'View case',
          href: 'https://github.com/example-org/sample-flagship',
        },
      ],
    },
    {
      id: 'proj-secondary',
      slug: 'sample-secondary-case',
      status: 'published',
      sort: 1,
      name: 'Sample Secondary Case',
      role: 'Contributor',
      short_description: 'Reputation tooling for a marketplace.',
      problem: 'Reputation signals were scattered across tools.',
      contribution: 'Unified reporting for moderation teams.',
      outcome: 'Faster review cycles for flagged accounts.',
      stack_tags: ['Vue', 'Postgres'],
      evidence_links: [
        {
          label: 'View timeline',
          href: '/experience#acme-senior-engineer',
        },
      ],
    },
  ],
  products: [
    {
      id: 'prod-converter',
      slug: 'sample-converter',
      status: 'published',
      sort: 0,
      name: 'Sample Converter',
      short_description: 'Convert playlists without touching source files.',
      description:
        'Sample Converter turns playlist exports into WAV or AIFF for import workflows.\n\nIncludes a desktop app and a CLI.',
      stack_tags: ['Python', 'FFmpeg'],
      logo: 'file-converter-logo',
      social_image: 'file-converter-social',
      benefits: [
        {
          title: 'Lossless input',
          description: 'Reads FLAC and WAV sources without modifying originals.',
        },
        {
          title: 'WAV and AIFF output',
          description: 'Stereo PCM with quality ceilings that never upsample.',
        },
      ],
      launch_lead: 'Convert playlists without touching source files.',
      launch_supporting_line: 'Download the desktop app, or use the CLI.',
      macos_download_warning: 'On first open use right click → open (ad hoc signed).',
      launch_ctas: [
        {
          buttons_id: {
            status: 'published',
            label: 'Download for macOS',
            href: 'https://github.com/example-org/sample-converter/releases',
            type: 'primary',
            href_source: 'github_macos_release',
          },
        },
        {
          buttons_id: {
            status: 'published',
            label: 'Other platforms',
            href: 'https://github.com/example-org/sample-converter/releases',
            type: 'secondary',
            href_source: 'static',
          },
        },
      ],
      trust_facts: [
        { label: 'macOS', value: '11+' },
        {
          label: 'License',
          value: 'GNU GPL v3',
          href: 'https://www.gnu.org/licenses/gpl-3.0.html',
        },
        { label: 'Privacy', value: 'Optional analytics' },
        {
          label: 'Issues',
          value: 'GitHub',
          href: 'https://github.com/example-org/sample-converter/issues',
        },
      ],
      trademark: 'Sample trademarks belong to their respective owners.',
      guide: {
        title: 'How to use',
        warning: 'Do not use File → Import. Point Imported Library at the generated import XML.',
        steps: [
          {
            title: 'Export playlist',
            body: 'Export the collection XML from the source app.',
          },
          {
            title: 'Convert in the app',
            body: 'Pick playlists, choose output format, then Convert.',
            image: {
              src: '/projects/sample-converter/main-window.webp',
              srcThumb: '/projects/sample-converter/main-window-600w.webp',
              srcset:
                '/projects/sample-converter/main-window-600w.webp 600w, /projects/sample-converter/main-window.webp 1200w',
              sizes: '(max-width: 1024px) 100vw, 56rem',
              alt: 'Sample Converter main window',
              width: 1200,
              height: 800,
            },
          },
        ],
      },
      github_owner: 'example-org',
      github_repo: 'sample-converter',
      seo_title: 'Sample Converter',
      seo_title_suffix: 'Ada Example',
      seo_description: 'Convert playlists to WAV or AIFF with a desktop app or CLI.',
      application_category: 'MultimediaApplication',
      operating_system: 'macOS, Linux, Windows',
      license_url: 'https://www.gnu.org/licenses/gpl-3.0.html',
      evidence_links: null,
    },
  ],
  claims: [
    {
      id: 'claim-tenure-1',
      key: 'homepage-proof-tenure-years',
      public_wording: '5+ — years across digital products',
      status: 'published',
    },
    {
      id: 'claim-proof-1',
      key: 'homepage-proof-users',
      public_wording: '10K+ — active users on platform tools',
      status: 'published',
    },
    {
      id: 'claim-acme-1',
      key: 'acme-senior-engineer-outcome-1',
      public_wording: 'Cut booking support tickets by a measurable share.',
      status: 'published',
    },
  ],
  files: [
    {
      id: 'file-acme-icon',
      filename_download: 'acme.png',
      title: '/images/experience/acme.png',
    },
    {
      id: 'file-converter-logo',
      filename_download: 'sample-converter-logo.webp',
      title: '/projects/sample-converter/sample-converter-logo.webp',
    },
    {
      id: 'file-converter-logo-thumb',
      filename_download: 'sample-converter-logo-256w.webp',
      title: '/projects/sample-converter/sample-converter-logo-256w.webp',
    },
    {
      id: 'file-converter-social',
      filename_download: 'sample-converter-social.webp',
      title: '/projects/sample-converter/sample-converter-social.webp',
    },
    {
      id: 'file-converter-main',
      filename_download: 'main-window.webp',
      title: '/projects/sample-converter/main-window.webp',
    },
    {
      id: 'file-converter-main-thumb',
      filename_download: 'main-window-600w.webp',
      title: '/projects/sample-converter/main-window-600w.webp',
    },
  ],
}
