import { describe, expect, it } from 'vitest'
import { mapPortfolio } from '~/utils/cms/map'
import { PRIVATE_FIELDS } from '~/utils/cms/fields'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'

const BASE = { baseUrl: 'https://cms.example.test' }

describe('CMS portfolio mappers', () => {
  const mapped = mapPortfolio(cmsPortfolioFixture, BASE)

  it('maps experience contributions and claim-backed outcomes', () => {
    const upwork = mapped.experience.find(r => r.id === 'upwork-reputation-team')
    expect(upwork?.contributions[0]).toMatch(/Partner Certified Talent/)
    expect(upwork?.outcomes[0].text).toMatch(/millions of freelancers/)
    expect(upwork?.icon).toBe('/images/experience/upwork.png')
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

  it('fails closed when site_settings.page_copy is missing', () => {
    expect(() =>
      mapPortfolio(
        {
          ...cmsPortfolioFixture,
          site: { ...cmsPortfolioFixture.site, page_copy: null },
        },
        BASE,
      ),
    ).toThrow(/site_settings\.page_copy is required/)
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

  it('passes through page_copy and uses contact / spotlight labels from it', () => {
    expect(mapped.homepage.siteName).toBe('Kazansky.dev')
    expect(mapped.homepage.pageCopy.contact.card_heading).toBe('Get in touch')
    expect(mapped.homepage.contact.email.label).toBe('Email')
    expect(mapped.homepage.contact.telegram.label).toBe('Telegram')
    expect(mapped.homepage.products.items[0]?.cta.label).toBe('View product')
    expect(mapped.homepage.seoTitle).toBe(
      'Daniel Kazansky | AI-Native Full-Stack Engineer',
    )
  })

  it('seeds sidebar nav from site_settings.menu', () => {
    expect(mapped.homepage.navItems.map(item => item.label)).toEqual([
      'Work',
      'Experience',
      'Products',
      'Contact',
      'GitHub',
    ])
    expect(mapped.homepage.navItems[4]?.href).toBe('https://github.com/slnnzmtl')
  })

  it('rewrites product screenshots to Directus assets via file titles', () => {
    const image = mapped.homepage.products.items[0]?.image
    expect(image?.src).toBe(
      '/projects/rekordbox-playlist-converter/macos-app-main-window.webp',
    )
    const logo = mapped.products[0]?.logo
    expect(logo?.src).toContain('simple-rekordbox-converter-logo.webp')
    expect(logo?.srcThumb).toContain('simple-rekordbox-converter-logo-256w.webp')
  })

  it('builds proof chips from tenure plus claim wording', () => {
    expect(mapped.homepage.proof).toEqual([
      { value: '8+', label: 'years across digital products' },
      { value: 'Millions', label: 'Marketplace products serving millions' },
      { value: '10M+', label: 'analytics data points' },
      { value: '25%', label: 'higher onboarding completion' },
    ])
  })

  it('marks only the first featured case as flagship', () => {
    expect(mapped.homepage.featuredCases.map(c => c.featured)).toEqual([true, false, false])
  })

  it('uses guide screenshot for product spotlight image', () => {
    const image = mapped.homepage.products.items[0]?.image
    expect(image?.src).toContain('macos-app-main-window.webp')
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
