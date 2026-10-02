import { productPath, type Product } from '../data/types'
import {
  absoluteUrl,
  type PageSeo,
} from '~/utils/seo'

function socialImage(product: Product) {
  return product.socialImage
    || (product.detailTemplate === 'extension'
      ? product.media.find(item => item.presentation === 'comparison_after')
      : undefined)
    || product.logo
}

export interface ProductsIndexSeoOptions {
  siteName: string
  title?: string
  description: string
  collectionName?: string
}

export function productsIndexSeo(
  siteUrl: string,
  products: Product[],
  options: ProductsIndexSeoOptions,
): PageSeo {
  const siteName = options.siteName
  if (!siteName?.trim()) {
    throw new Error('productsIndexSeo requires options.siteName from CMS')
  }
  if (!options.description?.trim()) {
    throw new Error('productsIndexSeo requires options.description from CMS')
  }
  const collectionName = options.collectionName || options.title || 'Products'
  const path = '/products'
  const url = absoluteUrl(siteUrl, path)
  const image = socialImage(products[0])
  const description = options.description
  return {
    title: `${collectionName} | ${siteName}`,
    description,
    path,
    robots: 'index, follow',
    ogType: 'website',
    image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': collectionName,
      'description': description,
      url,
      'isPartOf': {
        '@type': 'WebSite',
        'name': siteName,
        'url': absoluteUrl(siteUrl, '/'),
      },
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': products.map((product, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': product.name,
          'url': absoluteUrl(siteUrl, productPath(product.slug)),
        })),
      },
    },
  }
}

export interface ProductDetailSeoOptions {
  siteName: string
  personName: string
  productsLabel?: string
}

export function productDetailSeo(
  siteUrl: string,
  product: Product,
  options: ProductDetailSeoOptions,
): PageSeo {
  if (!options.siteName?.trim()) {
    throw new Error('productDetailSeo requires options.siteName from CMS')
  }
  if (!options.personName?.trim()) {
    throw new Error('productDetailSeo requires options.personName from CMS')
  }
  const siteName = options.siteName
  const personName = options.personName
  const productsLabel = options.productsLabel || 'Products'
  const path = productPath(product.slug)
  const url = absoluteUrl(siteUrl, path)
  const description = product.seo?.description ?? product.shortDescription
  const titleSuffix = product.seo?.titleSuffix ?? siteName
  const title = `${product.seo?.title ?? product.name} | ${titleSuffix}`
  const image = socialImage(product)
  const software = product.softwareApplication
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': personName,
          'item': absoluteUrl(siteUrl, '/'),
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': productsLabel,
          'item': absoluteUrl(siteUrl, '/products'),
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': product.name,
          'item': url,
        },
      ],
    },
  ]

  if (software) {
    graph.unshift({
      '@type': 'SoftwareApplication',
      'name': product.name,
      description,
      url,
      'image': image ? absoluteUrl(siteUrl, image.src) : undefined,
      'applicationCategory': software.applicationCategory,
      'operatingSystem': software.operatingSystem,
      'license': software.license,
      'isAccessibleForFree': true,
      ...(software.installUrl ? { installUrl: software.installUrl } : {}),
      ...(software.softwareRequirements
        ? { softwareRequirements: software.softwareRequirements }
        : {}),
      ...(software.priceAmount != null && software.priceCurrency
        ? {
            offers: {
              '@type': 'Offer',
              'price': software.priceAmount,
              'priceCurrency': software.priceCurrency,
              ...(software.installUrl ? { url: software.installUrl } : {}),
            },
          }
        : {}),
    })
  }

  return {
    title,
    description,
    path,
    robots: 'index, follow',
    ogType: 'website',
    image,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': graph,
    },
  }
}
