import { opensInNewTab, externalLinkRel } from '~/data/homepage'

const linkFocus
  = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

export function useHomepageUi() {
  function outboundAttrs(href: string) {
    return {
      target: opensInNewTab(href) ? '_blank' as const : undefined,
      rel: externalLinkRel(href),
    }
  }

  function profileLinkAria(label: string) {
    return label === 'CV' ? 'CV on LinkedIn' : label
  }

  return {
    linkFocus,
    outboundAttrs,
    profileLinkAria,
  }
}
