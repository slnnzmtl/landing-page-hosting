import { describe, expect, it } from 'vitest'
import { mapPortfolio } from '~/utils/cms/map'
import { PRIVATE_FIELDS } from '~/utils/cms/fields'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'

const BASE = { baseUrl: 'https://cms.example.test' }

describe('CMS portfolio mappers', () => {
  const mapped = mapPortfolio(cmsPortfolioFixture, BASE)

  it('maps experience contributions and claim-backed outcomes', () => {
    const role = mapped.experience.find(r => r.id === 'acme-senior-engineer')
    expect(role?.contributions[0]).toMatch(/CRM-connected/)
    expect(role?.outcomes[0].text).toMatch(/booking support/)
    expect(role?.icon).toBe('/images/experience/acme.png')
  })

  it('fails closed when site_settings.menu is empty', () => {
    expect(() =>
      mapPortfolio(
        {
          ...cmsPortfolioFixture,
          site: { ...cmsPortfolioFixture.site, menu: [] },
        },
        BASE,
      ),
    ).toThrow(/site_settings\.menu is required/)
  })

  it('fails closed when a singleton is not published', () => {
    expect(() =>
      mapPortfolio(
        {
          ...cmsPortfolioFixture,
          site: { ...cmsPortfolioFixture.site, status: 'draft' },
        },
        BASE,
      ),
    ).toThrow(/site_settings not published/)
    expect(() =>
      mapPortfolio(
        {
          ...cmsPortfolioFixture,
          homepageSettings: { ...cmsPortfolioFixture.homepageSettings, status: 'draft' },
        },
        BASE,
      ),
    ).toThrow(/homepage_settings not published/)
    expect(() =>
      mapPortfolio(
        {
          ...cmsPortfolioFixture,
          experiencePage: { ...cmsPortfolioFixture.experiencePage, status: 'draft' },
        },
        BASE,
      ),
    ).toThrow(/experience_page_settings not published/)
    expect(() =>
      mapPortfolio(
        {
          ...cmsPortfolioFixture,
          productsPage: { ...cmsPortfolioFixture.productsPage, status: 'draft' },
        },
        BASE,
      ),
    ).toThrow(/products_page_settings not published/)
  })

  it('fails closed when site_settings.site_name is missing', () => {
    expect(() =>
      mapPortfolio(
        {
          ...cmsPortfolioFixture,
          site: { ...cmsPortfolioFixture.site, site_name: null },
        },
        BASE,
      ),
    ).toThrow(/site_settings\.site_name is required/)
  })

  it('fails closed when homepage featured_projects is empty', () => {
    expect(() =>
      mapPortfolio(
        {
          ...cmsPortfolioFixture,
          homepageSettings: {
            ...cmsPortfolioFixture.homepageSettings,
            featured_projects: [],
          },
        },
        BASE,
      ),
    ).toThrow(/homepage_settings\.featured_projects is required/)
  })

  it('fails closed when homepage contact_links is empty', () => {
    expect(() =>
      mapPortfolio(
        {
          ...cmsPortfolioFixture,
          homepageSettings: {
            ...cmsPortfolioFixture.homepageSettings,
            contact_links: [],
          },
        },
        BASE,
      ),
    ).toThrow(/homepage_settings\.contact_links is required/)
  })

  it('fails closed when a contact link is missing title', () => {
    expect(() =>
      mapPortfolio(
        {
          ...cmsPortfolioFixture,
          homepageSettings: {
            ...cmsPortfolioFixture.homepageSettings,
            contact_links: [{ label: 'Email', href: 'mailto:ada@example.test' }],
          },
        },
        BASE,
      ),
    ).toThrow(/contact_links\[0\] requires label, href, and title/)
  })

  it('normalizes bare email contact hrefs to mailto', () => {
    const mappedBareEmail = mapPortfolio(
      {
        ...cmsPortfolioFixture,
        homepageSettings: {
          ...cmsPortfolioFixture.homepageSettings,
          contact_links: [{ label: 'Email', href: 'ada@example.test', title: 'ada@example.test' }],
        },
      },
      BASE,
    )
    expect(mappedBareEmail.homepage.contact.links).toEqual([
      { label: 'Email', href: 'mailto:ada@example.test', title: 'ada@example.test' },
    ])
  })

  it('fails closed when homepage chrome headings are missing', () => {
    expect(() =>
      mapPortfolio(
        {
          ...cmsPortfolioFixture,
          homepageSettings: {
            ...cmsPortfolioFixture.homepageSettings,
            proof_heading: '',
          },
        },
        BASE,
      ),
    ).toThrow(/homepage_settings\.proof_heading is required/)
  })

  it('assembles page copy from products_page_settings and spotlight CTA', () => {
    expect(mapped.homepage.siteName).toBe(cmsPortfolioFixture.site.site_name)
    expect(mapped.homepage.contact.links.map(link => link.label)).toEqual([
      'Email',
      'Telegram',
      'LinkedIn',
      'GitHub',
    ])
    expect(mapped.homepage.products.items[0]?.cta.label).toBe(
      cmsPortfolioFixture.homepageSettings.spotlight_cta,
    )
    expect(mapped.homepage.pageCopy.products_index.title).toBe(
      cmsPortfolioFixture.productsPage.title,
    )
    expect(mapped.homepage.pageCopy.product_detail.kicker).toBe(
      cmsPortfolioFixture.productsPage.kicker,
    )
    expect(mapped.homepage.seoTitle).toBe(cmsPortfolioFixture.site.seo_title)
    expect(mapped.homepage.proofHeading).toBe(
      cmsPortfolioFixture.homepageSettings.proof_heading,
    )
    expect(mapped.homepage.featuredWorkHeading).toBe(
      cmsPortfolioFixture.homepageSettings.featured_work_heading,
    )
    expect(mapped.homepage.flagshipLabel).toBe(
      cmsPortfolioFixture.homepageSettings.flagship_label,
    )
  })

  it('seeds sidebar nav from site_settings.menu', () => {
    expect(mapped.homepage.navItems.map(item => item.label)).toEqual(
      cmsPortfolioFixture.site.menu!.map(item => item.label),
    )
    expect(mapped.homepage.navItems[4]?.href).toBe(
      cmsPortfolioFixture.site.menu![4]!.href,
    )
  })

  it('rewrites leftover /projects catalog hrefs from CMS copy without touching media paths', () => {
    const result = mapPortfolio(
      {
        ...cmsPortfolioFixture,
        site: {
          ...cmsPortfolioFixture.site,
          menu: [
            { label: 'Work', href: '/' },
            { label: 'Products', href: '/projects' },
          ],
        },
        productsPage: {
          ...cmsPortfolioFixture.productsPage,
          back_href: '/',
          detail_back_href: '/projects',
        },
      },
      BASE,
    )
    expect(result.homepage.navItems.map(item => `${item.label}:${item.href}`)).toEqual([
      'Work:/',
      'Products:/products',
    ])
    expect(result.homepage.pageCopy.product_detail.back_href).toBe('/products')
    expect(result.homepage.products.items[0]?.image.src).toContain(
      '/projects/sample-converter/',
    )
  })

  it('rewrites product screenshots to Directus assets via file titles', () => {
    const image = mapped.homepage.products.items[0]?.image
    expect(image?.src).toBe('/projects/sample-converter/main-window.webp')
    const logo = mapped.products[0]?.logo
    expect(logo?.src).toContain('sample-converter-logo.webp')
    expect(logo?.srcThumb).toContain('sample-converter-logo-256w.webp')
  })

  it('builds proof chips from ordered claim wording including tenure', () => {
    expect(mapped.homepage.proof).toEqual([
      { value: '5+', label: 'years across digital products' },
      { value: '10K+', label: 'active users on platform tools' },
    ])
  })

  it('maps homepage CTAs from buttons M2M', () => {
    expect(mapped.homepage.primaryCtas).toEqual([
      { label: 'View flagship case', href: '#flagship-case' },
      { label: 'Discuss a project', href: '#contact' },
    ])
    expect(mapped.homepage.profileLinks[0]).toEqual({
      label: 'GitHub',
      href: 'https://github.com/example-org',
    })
    expect(mapped.homepage.experiencePreview.cta).toEqual({
      label: 'View full timeline',
      href: '/experience',
    })
  })

  it('marks only the first featured case as flagship', () => {
    expect(mapped.homepage.featuredCases.map(c => c.featured)).toEqual([true, false])
  })

  it('omits featured-case href when evidence_links are missing', () => {
    const project = cmsPortfolioFixture.projects[0]
    expect(project).toBeTruthy()
    const result = mapPortfolio(
      {
        ...cmsPortfolioFixture,
        projects: [{ ...project!, evidence_links: null }],
        homepageSettings: {
          ...cmsPortfolioFixture.homepageSettings,
          featured_projects: [{ projects_id: { slug: project!.slug } }],
        },
      },
      BASE,
    )
    const featured = result.homepage.featuredCases[0]
    expect(featured?.slug).toBe(project!.slug)
    expect(featured?.href).toBeUndefined()
    expect(featured?.hrefLabel).toBeUndefined()
  })

  it('uses guide screenshot for product spotlight image', () => {
    const image = mapped.homepage.products.items[0]?.image
    expect(image?.src).toContain('main-window.webp')
  })

  it('fails closed when a product spotlight has no guide image', () => {
    const product = cmsPortfolioFixture.products[0]
    expect(product).toBeTruthy()
    expect(() =>
      mapPortfolio(
        {
          ...cmsPortfolioFixture,
          products: [
            {
              ...product!,
              guide: {
                title: product!.guide?.title || 'Guide',
                steps: [{ title: 'Step', body: 'Body' }],
              },
            },
          ],
        },
        BASE,
      ),
    ).toThrow(/requires a guide step image/)
  })

  it('never leaks private Directus fields into the mapped payload', () => {
    const blob = JSON.stringify(mapped)
    for (const field of PRIVATE_FIELDS) {
      expect(blob).not.toContain(field)
    }
  })
})
