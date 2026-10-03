import { describe, expect, it } from 'vitest'
import { mapPortfolio } from '~/utils/cms/map'
import { productDetailSeo } from '~/domains/products/utils/product-seo'
import { cmsPortfolioFixture } from '~/tests/fixtures/cms-portfolio'
import type { CmsProduct } from '~/utils/cms/types'

const BASE = { baseUrl: 'https://cms.example.test' }

const extensionProduct: CmsProduct = {
  ...cmsPortfolioFixture.products[0]!,
  id: 'prod-extension',
  slug: 'soundcloud-ui-toolkit',
  name: 'SoundCloud UI Toolkit',
  detail_template: 'extension',
  logo: 'extension-icon',
  kicker: 'Chrome extension',
  short_description: 'Customize SoundCloud to fit your workflow.',
  description: 'A free extension for layout, queue, appearance, and rounding controls.',
  launch_lead: 'Customize SoundCloud to fit your workflow.',
  launch_supporting_line: 'A free Chromium extension with no analytics or ads.',
  launch_ctas: [
    {
      buttons_id: {
        status: 'published',
        label: 'Add to Chrome — Free',
        href: 'https://chromewebstore.google.com/detail/example',
        type: 'primary',
        href_source: 'static',
      },
    },
    {
      buttons_id: {
        status: 'draft',
        label: 'View source',
        href: 'https://github.com/example/soundcloud-ui-toolkit',
        type: 'secondary',
        href_source: 'static',
      },
    },
  ],
  price_amount: '0.00',
  price_currency: 'USD',
  software_requirements: 'Chrome 121+ or equivalent Chromium browser.',
  media_heading: 'See the difference',
  media_intro: 'Compare the default and customized layouts.',
  social_image: null,
  application_category: null,
  operating_system: null,
  license_url: null,
  github_owner: null,
  github_repo: null,
  media: [
    {
      id: 3,
      sort: 2,
      file: 'extension-after',
      alt: 'Customized SoundCloud layout',
      caption: 'After — customized layout.',
      presentation: 'comparison_after',
    },
    {
      id: 2,
      sort: 1,
      file: 'extension-before',
      alt: 'Default SoundCloud layout',
      caption: 'Before — default layout.',
      presentation: 'comparison_before',
    },
    {
      id: 4,
      sort: 3,
      file: 'extension-gallery',
      alt: 'SoundCloud extension controls',
      caption: 'Toolbar controls.',
      presentation: 'gallery',
    },
  ],
}

const extensionPortfolio = {
  ...cmsPortfolioFixture,
  products: [extensionProduct],
  homepageSettings: {
    ...cmsPortfolioFixture.homepageSettings,
    product_spotlights: [{ products_id: { slug: 'soundcloud-ui-toolkit' } }],
  },
  files: [
    ...(cmsPortfolioFixture.files || []),
    {
      id: 'extension-icon',
      filename_download: 'icon-128.png',
      title: '/projects/soundcloud-ui-toolkit/soundcloud-ui-toolkit-icon-128.png',
      type: 'image/png',
      width: 128,
      height: 128,
    },
    {
      id: 'extension-before',
      filename_download: 'before.png',
      title: '/projects/soundcloud-ui-toolkit/before.png',
      type: 'image/png',
      width: 1280,
      height: 800,
    },
    {
      id: 'extension-after',
      filename_download: 'after.png',
      title: '/projects/soundcloud-ui-toolkit/after.png',
      type: 'image/png',
      width: 1280,
      height: 800,
    },
    {
      id: 'extension-gallery',
      filename_download: 'gallery.png',
      title: '/projects/soundcloud-ui-toolkit/gallery.png',
      type: 'image/png',
      width: 1280,
      height: 800,
    },
  ],
}

describe('extension product mapping', () => {
  it('maps template-specific fields and ordered media without draft CTAs', () => {
    const product = mapPortfolio(extensionPortfolio, BASE).products[0]!
    expect(product.detailTemplate).toBe('extension')
    if (product.detailTemplate !== 'extension') return

    expect(product.price).toEqual({ amount: 0, currency: 'USD' })
    expect(product.media.map(item => item.presentation)).toEqual([
      'comparison_before',
      'comparison_after',
      'gallery',
    ])
    expect(product.media[0]?.srcset).toContain('-640w.webp 640w')
    expect(product.socialImage?.src).toContain('after.png')
    expect(product.logo?.src).toContain('soundcloud-ui-toolkit-icon-128.png')
    expect(product.logo?.srcThumb).toBeUndefined()
    expect(product.launch?.ctas.map(cta => cta.label)).toEqual(['Add to Chrome — Free'])
    expect(product.softwareApplication).toMatchObject({
      applicationCategory: 'BrowserApplication',
      operatingSystem: 'Chrome 121+ or equivalent Chromium browser.',
      priceAmount: 0,
      priceCurrency: 'USD',
    })
  })

  it('fails closed when comparison media has no accessible alt text', () => {
    expect(() => mapPortfolio({
      ...extensionPortfolio,
      products: [{
        ...extensionProduct,
        media: extensionProduct.media?.map(item => (
          item.presentation === 'comparison_before' ? { ...item, alt: '' } : item
        )),
      }],
    }, BASE)).toThrow(/alt text/)
  })

  it('emits BrowserApplication offers and extension requirements', () => {
    const product = mapPortfolio(extensionPortfolio, BASE).products[0]!
    const page = productDetailSeo('https://example.test', product, {
      siteName: 'Example.dev',
      personName: 'Ada Example',
    })
    const software = (page.jsonLd['@graph'] as Array<Record<string, unknown>>)
      .find(node => node['@type'] === 'SoftwareApplication')!
    expect(software.applicationCategory).toBe('BrowserApplication')
    expect(software.softwareRequirements).toMatch(/Chrome 121/)
    expect(software.offers).toEqual(expect.objectContaining({
      '@type': 'Offer',
      'price': 0,
      'priceCurrency': 'USD',
    }))
  })
})
